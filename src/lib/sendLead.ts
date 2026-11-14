/** Client side of POST /api/contact (api/contact.ts), which emails the lead via Resend. */

export type LeadAttachment = { filename: string; type: string; content: string }

export type LeadPayload = {
  form: 'contact' | 'marathon'
  name: string
  phone: string
  email?: string
  message?: string
  business?: string
  plan?: string
  /** Honeypot field; real visitors leave it empty. */
  company?: string
  attachment?: LeadAttachment
}

/** Keep in sync with MAX_ATTACHMENT_BYTES in api/contact.ts. */
export const MAX_ATTACHMENT_BYTES = 3_000_000

export async function sendLead(payload: LeadPayload): Promise<boolean> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean }
    return res.ok && json.ok === true
  } catch {
    return false
  }
}

/** Reads a picked file as base64 (without the data: prefix) for the email attachment. */
export function fileToAttachment(file: File): Promise<LeadAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      resolve({ filename: file.name, type: file.type, content: result.slice(result.indexOf(',') + 1) })
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
