import { useEffect, useRef, useState } from 'react'
import { site } from '../../data/site'
import { clients } from '../../data/clients'
import { ClientLogos } from '../clients/ClientLogos'
import { ContactForm } from '../contact/ContactForm'
import { useInView } from '../../motion/useInView'
import { WaveDecor } from './WaveDecor'

function emailLabel(email: string) {
  const [local, domain = ''] = email.split('@')
  return `${local}@${domain.toUpperCase()}`
}

export function SiteFooter() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [titleIn, setTitleIn] = useState(false)
  const contactMotion = useInView<HTMLDivElement>({ threshold: 0.15 })

  useEffect(() => {
    const title = titleRef.current
    if (!title) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTitleIn(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setTitleIn(true)
        observer.disconnect()
      },
      { threshold: 0.6 },
    )
    observer.observe(title)
    return () => observer.disconnect()
  }, [])

  return (
    <footer className="site-footer" id="contact">
      <div className="logo-band">
        <div className="wrap">
          <h2
            className={titleIn ? 'logo-band-title is-in' : 'logo-band-title'}
            ref={titleRef}
          >
            {clients.title.split(' ').map((word, index) => (
              <span key={`${word}-${index}`} style={{ animationDelay: `${index * 0.1}s` }}>
                {word}
              </span>
            ))}
            <i className="logo-band-rule" aria-hidden="true" />
          </h2>
        </div>
        <ClientLogos />
      </div>
      <div className="footer-contact">
        <WaveDecor variant="footer" />
        <div className="wrap footer-inner">
          <div
            className={
              contactMotion.visible ? 'footer-grid footer-reveal is-visible' : 'footer-grid footer-reveal'
            }
            ref={contactMotion.ref}
          >
            <div className="cinfo">
              <h2>{site.contactTitle}</h2>
              <p className="cinfo-lead">{site.contactLead}</p>
              <a className="cinfo-item" href={site.phoneHref}>
                <span className="cinfo-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 3.5h3.2l1.2 3.1-1.8 1.1a12 12 0 0 0 5.7 5.7l1.1-1.8 3.1 1.2V16a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 5 7.7 2 2 0 0 1 7 3.5Z" />
                  </svg>
                </span>
                <span className="cinfo-text">
                  <span className="cinfo-label">{site.contactPhoneLabel}</span>
                  <span>{site.phoneDisplay}</span>
                </span>
              </a>
              <a className="cinfo-item" href={`mailto:${site.email}`}>
                <span className="cinfo-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                    <path d="m4.5 7 7.5 6 7.5-6" />
                  </svg>
                </span>
                <span className="cinfo-text">
                  <span className="cinfo-label">{site.contactEmailLabel}</span>
                  <span>{emailLabel(site.email)}</span>
                </span>
              </a>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </footer>
  )
}
