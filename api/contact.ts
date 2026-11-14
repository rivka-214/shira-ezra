/**
 * POST /api/contact — sends a site lead to Shira by email through Resend.
 *
 * Runs on the server (a Vercel Function, and the Vite dev server locally), so the
 * Resend API key never reaches the browser.
 *
 * Environment variables:
 *   RESEND_API_KEY      required — from https://resend.com/api-keys
 *   CONTACT_TO_EMAIL    who receives the leads (default: Shira's address)
 *   CONTACT_FROM_EMAIL  sender; must be on a domain verified in Resend
 *                       (default: Resend's test sender, which can only mail the account owner)
 */

const RESEND_URL = 'https://api.resend.com/emails'
const DEFAULT_TO = 'Sh0548445344@gmail.com'
const DEFAULT_FROM = 'האתר של שירה עזרא <onboarding@resend.dev>'

/** Vercel rejects request bodies over 4.5MB; base64 adds about a third. */
export const MAX_ATTACHMENT_BYTES = 3_000_000
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']

type FormKind = 'contact' | 'marathon'

type Attachment = { filename: string; type: string; content: string }

type Lead = {
  form: FormKind
  name: string
  phone: string
  email: string
  message: string
  business: string
  plan: string
  company: string
  attachment: Attachment | null
}

const LIMITS = { name: 120, phone: 40, email: 160, message: 4000, business: 160, plan: 120 }

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function str(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function readAttachment(raw: unknown): Attachment | null | 'invalid' {
  if (!raw || typeof raw !== 'object') return null
  const a = raw as Record<string, unknown>
  const filename = str(a.filename, 120).replace(/[\\/]/g, '_')
  const type = str(a.type, 60)
  const content = typeof a.content === 'string' ? a.content : ''
  if (!filename || !content || !ALLOWED_TYPES.includes(type)) return 'invalid'
  if (!/^[A-Za-z0-9+/]+=*$/.test(content)) return 'invalid'
  if (Math.floor((content.length * 3) / 4) > MAX_ATTACHMENT_BYTES) return 'invalid'
  return { filename, type, content }
}

function parseLead(body: unknown): Lead | string {
  if (!body || typeof body !== 'object') return 'bad-request'
  const b = body as Record<string, unknown>
  const form: FormKind = b.form === 'marathon' ? 'marathon' : 'contact'
  const attachment = readAttachment(b.attachment)
  if (attachment === 'invalid') return 'bad-attachment'
  const lead: Lead = {
    form,
    name: str(b.name, LIMITS.name),
    phone: str(b.phone, LIMITS.phone),
    email: str(b.email, LIMITS.email),
    message: str(b.message, LIMITS.message),
    business: str(b.business, LIMITS.business),
    plan: str(b.plan, LIMITS.plan),
    company: str(b.company, 200),
    attachment: form === 'marathon' ? attachment : null,
  }
  if (!lead.name || !lead.phone) return 'missing-fields'
  if (form === 'marathon' && !lead.email) return 'missing-fields'
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return 'bad-email'
  return lead
}

function buildEmail(lead: Lead) {
  const rows: [string, string][] =
    lead.form === 'marathon'
      ? [
          ['שם', lead.name],
          ['שם העסק', lead.business || '—'],
          ['מייל', lead.email],
          ['טלפון', lead.phone],
          ['המסלול', lead.plan || '—'],
          ['לוגו / חתימה', lead.attachment ? `מצורף: ${lead.attachment.filename}` : 'לא צורף'],
        ]
      : [
          ['שם', lead.name],
          ['טלפון', lead.phone],
          ['מייל', lead.email || '—'],
          ['הודעה', lead.message || '(ללא הודעה נוספת)'],
        ]

  const subject =
    lead.form === 'marathon'
      ? `מרתון הנפשות — ${lead.name}${lead.business ? ` — ${lead.business}` : ''}`
      : `פנייה מהאתר — ${lead.name}`
  const heading = lead.form === 'marathon' ? 'פנייה חדשה ממרתון הנפשות' : 'פנייה חדשה מהאתר'

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 0 6px 16px;color:#45405c;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 0;color:#150440;font-weight:600;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  const html =
    `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">` +
    `<h2 style="margin:0 0 12px;color:#301ab3">${escapeHtml(heading)}</h2>` +
    `<table style="border-collapse:collapse">${htmlRows}</table>` +
    (lead.email ? `<p style="color:#45405c">אפשר להשיב למייל הזה כדי לענות ישירות.</p>` : '') +
    `</div>`

  const text = [heading, '', ...rows.map(([label, value]) => `${label}: ${value}`)].join('\n')

  return { subject, html, text }
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set')
    return json(500, { ok: false, error: 'not-configured' })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json(400, { ok: false, error: 'bad-request' })
  }

  const lead = parseLead(body)
  if (typeof lead === 'string') return json(400, { ok: false, error: lead })

  // Honeypot filled in: a bot. Pretend it worked and send nothing.
  if (lead.company) return json(200, { ok: true })

  const { subject, html, text } = buildEmail(lead)
  const payload: Record<string, unknown> = {
    from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
    to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO],
    subject,
    html,
    text,
  }
  if (lead.email) payload.reply_to = lead.email
  if (lead.attachment) {
    payload.attachments = [{ filename: lead.attachment.filename, content: lead.attachment.content }]
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error('[contact] Resend rejected the email', res.status, await res.text())
      return json(502, { ok: false, error: 'send-failed' })
    }
    return json(200, { ok: true })
  } catch (error) {
    console.error('[contact] Could not reach Resend', error)
    return json(502, { ok: false, error: 'send-failed' })
  }
}

export function GET(): Response {
  return json(405, { ok: false, error: 'method-not-allowed' })
}
