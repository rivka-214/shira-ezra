import { useId, useState, type FormEvent } from 'react'
import { marathonContent as c } from '../../data/marathon'
import { fileToAttachment, MAX_ATTACHMENT_BYTES, sendLead } from '../../lib/sendLead'

type Status = 'idle' | 'sending' | 'success' | 'error' | 'file-error' | 'send-error'

const ACCEPT = 'image/png,image/jpeg,image/gif,image/webp'

/** Sends the marathon lead (with the logo attached) to Shira through /api/contact. */
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

    const name = text('name')
    const email = text('email')
    const phone = text('phone')
    if (!name || !phone || !email) {
      setStatus('error')
      return
    }

    const picked = data.get('attachment')
    const file = picked instanceof File && picked.size > 0 ? picked : null
    if (file && file.size > MAX_ATTACHMENT_BYTES) {
      setStatus('file-error')
      return
    }

    setStatus('sending')
    let attachment
    try {
      attachment = file ? await fileToAttachment(file) : undefined
    } catch {
      setStatus('file-error')
      return
    }
    const sent = await sendLead({
      form: 'marathon',
      name,
      phone,
      email,
      business: text('business'),
      plan: text('plan') || c.form.planDefault,
      attachment,
    })
    if (!sent) {
      setStatus('send-error')
      return
    }
    setStatus('success')
    form.reset()
    setFileName('')
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
            if (next && next.size > MAX_ATTACHMENT_BYTES) setStatus('file-error')
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
