import { site } from '../../data/site'
import { clients } from '../../data/clients'
import { ClientLogos } from '../clients/ClientLogos'
import { ContactForm } from '../contact/ContactForm'
import { WaveDecor } from './WaveDecor'

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="logo-band">
        <div className="wrap">
          <h2>{clients.title}</h2>
        </div>
        <ClientLogos />
      </div>
      <div className="footer-contact">
        <WaveDecor variant="footer" />
        <div className="wrap footer-inner">
          <div className="footer-grid">
            <div className="cinfo">
              <h2>פרטי קשר</h2>
              <a className="cinfo-item" href={site.phoneHref}>
                {site.phoneDisplay}
              </a>
              <a className="cinfo-item" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </footer>
  )
}
