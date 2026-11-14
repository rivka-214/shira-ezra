import { Link, NavLink, useLocation } from 'react-router-dom'
import { domainEntries, routes, site } from '../../data/site'

/** The marathon page has its own form instead of the shared footer's #contact. */
const contactHashFor = (pathname: string) =>
  pathname === routes.marathon ? '#marathon-form' : '#contact'

export function SiteHeader() {
  const { pathname } = useLocation()
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link to="/" className="brand" aria-label={`${site.name} — דף הבית`}>
          <img src={site.logoSrc} alt={site.name} />
        </Link>
        <div className="header-actions">
          <nav className="main-nav" aria-label="תחומים">
            {domainEntries.map((d) => (
              <NavLink key={d.key} to={d.path} className="nav-link">
                {d.label}
              </NavLink>
            ))}
          </nav>
          <a className="btn btn-lime header-cta" href={contactHashFor(pathname)}>
            דברו איתי
          </a>
        </div>
      </div>
    </header>
  )
}
