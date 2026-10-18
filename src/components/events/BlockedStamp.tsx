import { site } from '../../data/site'

type Props = {
  subject: string
  body: string
  className?: string
}

export function BlockedStamp({ subject, body, className = '' }: Props) {
  const mailHref =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${encodeURIComponent(site.email)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`

  return (
    <a
      className={['blocked-stamp', className].filter(Boolean).join(' ')}
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

export const eventsBlockedMail = {
  subject: 'חסום לי הקליפ אירועים באתר :(',
  body: ['אשמח שתשלחו לי לכאן.', 'תודה (:', '', 'שם:', 'טלפון:'].join('\n'),
} as const

export const businessBlockedMail = {
  subject: 'חסום לי סרטוני התדמית באתר ):',
  body: [
    'חסום לי סרטוני התדמית באתר ):',
    '',
    'אשמח שתשלחי לי לכאן.',
    'תודה (:',
    '',
    'שם:',
    'טלפון:',
  ].join('\n'),
} as const
