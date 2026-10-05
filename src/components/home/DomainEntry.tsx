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
      {homePills.map((d) => (
        <Link className="domain-card" to={d.path} key={d.label}>
          {d.label}
        </Link>
      ))}
    </div>
  )
}
