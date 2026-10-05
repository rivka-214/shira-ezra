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
          style={{ animationDelay: `${0.34 + index * 0.12}s` }}
        >
          {d.label}
        </Link>
      ))}
    </div>
  )
}
