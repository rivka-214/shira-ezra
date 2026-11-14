import { useId, useState, type FormEvent } from 'react'
import { marathonContent as c } from '../../data/marathon'

type Status = 'idle' | 'sending' | 'success' | 'success-no-file' | 'error' | 'file-error' | 'send-error'

/** Same service and key as the site's main contact form (ContactForm). */
const WEB3FORMS_URL = 'https://api.web3forms.com/submit'
const ACCEPT = 'image/png,image/jpeg,image/gif,image/webp'
const MAX_FILE_BYTES = 5_000_000

type Fields = {
  name: string
  business: string
  email: string
  phone: string
  plan: string
}

function messageBody(f: Fields, fileName: string) {
  return [
    'פנייה חדשה ממרתון הנפשות',
    '',
    `שם: ${f.name}`,
    `שם העסק: ${f.business}`,
    `מייל: ${f.email}`,
    `טלפון: ${f.phone}`,
    `המסלול: ${f.plan}`,
    `לוגו / חתימה: ${fileName || 'לא צורף'}`,
  ].join('\n')
}

async function submit(accessKey: string, f: Fields, file: File | null): Promise<boolean> {
  const payload = new FormData()
  payload.append('access_key', accessKey)
  payload.append('subject', `מרתון הנפשות — ${f.name} — ${f.business}`)
  payload.append('from_name', f.name)
  payload.append('replyto', f.email)
  payload.append('name', f.name)
  payload.append('business', f.business)
  payload.append('email', f.email)
  payload.append('phone', f.phone)
  payload.append('plan', f.plan)
  payload.append('message', messageBody(f, file?.name ?? ''))
  if (file) payload.append('attachment', file)

  const res = await fetch(WEB3FORMS_URL, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: payload,
  })
  const json = (await res.json().catch(() => ({}))) as { success?: boolean }
  return res.ok && Boolean(json.success)
}

/** Sends the marathon lead straight to Shira's inbox via Web3Forms, like the main contact form. */
export function MarathonForm() {
  const id = useId()
  const [status, setStatus] = useState<Status>('idle')
  const [fileName, setFileName] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const data = new FormData(form)
    const text = (key: string) => String(data.get(key) ?? '').trim()

    if (text('company')) {
      // Honeypot filled in: a bot. Pretend it worked.
      setStatus('success')
      return
    }

    const fields: Fields = {
      name: text('name'),
      business: text('business'),
      email: text('email'),
      phone: text('phone'),
      plan: text('plan') || c.form.planDefault,
    }
    if (!fields.name || !fields.phone || !fields.email) {
      setStatus('error')
      return
    }

    const picked = data.get('attachment')
    const file = picked instanceof File && picked.size > 0 ? picked : null
    if (file && file.size > MAX_FILE_BYTES) {
      setStatus('file-error')
      return
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      setStatus('send-error')
      return
    }

    setStatus('sending')
    try {
      if (await submit(accessKey, fields, file)) {
        setStatus('success')
      } else if (file && (await submit(accessKey, fields, null))) {
        // File uploads need a paid Web3Forms plan; the details still reach Shira without it.
        setStatus('success-no-file')
      } else {
        setStatus('send-error')
        return
      }
      form.reset()
      setFileName('')
    } catch {
      setStatus('send-error')
    }
  }

  return (
    <form className="mr-form-card" onSubmit={onSubmit} noValidate>
      <label className="mr-hp" aria-hidden="true">
        חברה
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="mr-form-row">
        <div className="mr-field">
          <label htmlFor={`${id}-name`}>שם</label>
          <input className="mr-input" id={`${id}-name`} name="name" type="text" autoComplete="name" required />
        </div>
        <div className="mr-field">
          <label htmlFor={`${id}-biz`}>שם העסק</label>
          <input className="mr-input" id={`${id}-biz`} name="business" type="text" autoComplete="organization" />
        </div>
      </div>
      <div className="mr-form-row">
        <div className="mr-field">
          <label htmlFor={`${id}-mail`}>מייל</label>
          <input
            className="mr-input mr-input-ltr"
            id={`${id}-mail`}
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            required
          />
        </div>
        <div className="mr-field">
          <label htmlFor={`${id}-tel`}>טלפון</label>
          <input
            className="mr-input mr-input-ltr"
            id={`${id}-tel`}
            name="phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            required
          />
        </div>
      </div>
      <div className="mr-field">
        <label htmlFor={`${id}-plan`}>{c.form.planLabel}</label>
        <select className="mr-input" id={`${id}-plan`} name="plan" defaultValue={c.form.planDefault}>
          <option>{c.form.planDefault}</option>
          {c.pricing.plans.map((p) => (
            <option key={p.formLabel}>{p.formLabel}</option>
          ))}
        </select>
      </div>
      <label className="mr-upload" htmlFor={`${id}-file`}>
        <span className="mr-upload-btn">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
            <rect x="2.5" y="3.5" width="15" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="7.5" cy="8" r="1.4" fill="currentColor" />
            <path d="M3 15l4.5-4.5 3 3 2-2L17 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          {c.form.fileButton}
        </span>
        <span className="mr-upload-hint">{fileName || c.form.fileHint}</span>
        <input
          className="mr-visually-hidden"
          id={`${id}-file`}
          name="attachment"
          type="file"
          accept={ACCEPT}
          onChange={(e) => {
            const next = e.currentTarget.files?.[0]
            setFileName(next?.name ?? '')
            if (next && next.size > MAX_FILE_BYTES) setStatus('file-error')
            else if (status === 'file-error') setStatus('idle')
          }}
        />
      </label>
      <button className="mr-btn mr-btn-lime mr-btn-block mr-btn-lg" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? c.form.sending : `${c.cta} ←`}
      </button>
      {status === 'success' ? (
        <p className="mr-form-msg is-ok" role="status">
          {c.form.success}
        </p>
      ) : null}
      {status === 'success-no-file' ? (
        <p className="mr-form-msg is-ok" role="status">
          {c.form.successNoFile}
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="mr-form-msg is-err" role="alert">
          {c.form.missingFields}
        </p>
      ) : null}
      {status === 'file-error' ? (
        <p className="mr-form-msg is-err" role="alert">
          {c.form.fileTooBig}
        </p>
      ) : null}
      {status === 'send-error' ? (
        <p className="mr-form-msg is-err" role="alert">
          {c.form.sendError}
        </p>
      ) : null}
    </form>
  )
}
