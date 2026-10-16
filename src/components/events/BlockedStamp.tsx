import { site } from '../../data/site'

const MAIL_SUBJECT = 'חסום לי הקליפ אירועים באתר :('
const MAIL_BODY = [
  'אשמח שתשלחו לי לכאן.',
  'תודה (:',
  '',
  'שם:',
  'טלפון:',
].join('\n')

export function BlockedStamp() {
  const mailHref =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${encodeURIComponent(site.email)}` +
    `&su=${encodeURIComponent(MAIL_SUBJECT)}` +
    `&body=${encodeURIComponent(MAIL_BODY)}`

  return (
    <a
      className="blocked-stamp"
      href={mailHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`חסומה? פתיחת Gmail לכתיבה אל ${site.email}`}
    >
      <span className="blocked-stamp-ring" aria-hidden="true" />
      <span className="blocked-stamp-text">חסומה?</span>
    </a>
  )
}
