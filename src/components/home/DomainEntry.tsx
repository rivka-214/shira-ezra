import { Link } from 'react-router-dom'
import { routes } from '../../data/site'

const homePills = [
  { label: 'וידאו', path: routes.video },
  { label: 'תדמית ועסקים', path: routes.business },
  { label: 'אירועים', path: routes.events },
] as const

export function DomainEntry() {
  return (
    <div className="domain-grid">
      {homePills.map((d, index) => (
        <Link
          className="domain-card home-rise"
          to={d.path}
          key={d.label}
          style={{ animationDelay: `${0.42 + index * 0.14}s` }}
        >
          <span className="domain-card-label">
            {d.label}
            <svg className="domain-card-arrow" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M3 8h8M9 5l3 3-3 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  )
}
