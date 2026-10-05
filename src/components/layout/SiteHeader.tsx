import { Link, NavLink } from 'react-router-dom'
import { domainEntries, site } from '../../data/site'

export function SiteHeader() {
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
          <a className="btn btn-lime header-cta" href="#contact">
            דברו איתי
          </a>
        </div>
      </div>
    </header>
  )
}
