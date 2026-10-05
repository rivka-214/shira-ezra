import { useState, type FormEvent } from 'react'
import { site } from '../../data/site'

type Status = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const honeypot = String(data.get('company') ?? '').trim()
    if (honeypot) {
      setStatus('success')
      return
    }
    if (!name || !phone) {
      setStatus('error')
      return
    }
    setStatus('sending')
    const body = `שם: ${name}\nטלפון: ${phone}\nאימייל: ${email}\n\n${message}`
    const href = `mailto:${site.email}?subject=${encodeURIComponent('פנייה מהאתר')}&body=${encodeURIComponent(body)}`
    window.location.href = href
    setStatus('success')
    form.reset()
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <h2>מתחילים מכאן</h2>
      <label className="hp" aria-hidden="true">
        חברה
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form-row">
        <label>
          השם שלכם
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          טלפון
          <input name="phone" type="tel" required autoComplete="tel" />
        </label>
      </div>
      <label>
        כתובת אימייל
        <input name="email" type="email" autoComplete="email" />
      </label>
      <label>
        ספרו לי קצת על מה שאתם מחפשים...
        <textarea name="message" rows={1} />
      </label>
      <button className="btn btn-lime form-submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'שולחת…' : 'שליחת טופס'}
      </button>
      {status === 'success' ? (
        <p className="form-ok" role="status">
          נפתח מייל מוכן לשליחה אל שירה.
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="form-err" role="alert">
          נא למלא שם וטלפון.
        </p>
      ) : null}
    </form>
  )
}
