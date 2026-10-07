export type FindCategoryIconName = 'film' | 'camera' | 'photo' | 'aperture'

type Props = {
  name: FindCategoryIconName
  active?: boolean
  delay?: number
}

function pathStyle(delay: number) {
  return { animationDelay: `${delay}s` }
}

export function FindCategoryIcon({ name, active = false, delay = 0 }: Props) {
  const rootClass = active ? 'find-icon is-active' : 'find-icon'

  if (name === 'film') {
    return (
      <svg className={rootClass} viewBox="0 0 100 120" aria-hidden="true">
        <path
          className="find-icon-path"
          pathLength="1"
          style={pathStyle(delay)}
          d="M28 8h44a8 8 0 0 1 8 8v88a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8z"
        />
        <path
          className="find-icon-path"
          pathLength="1"
          style={pathStyle(delay + 0.12)}
          d="M36 20h28v32H36V20zm0 44h28v32H36V64z"
        />
        <path
          className="find-icon-path find-icon-detail"
          pathLength="1"
          style={pathStyle(delay + 0.22)}
          d="M22 36h6M22 52h6M22 68h6M22 84h6M72 36h6M72 52h6M72 68h6M72 84h6"
        />
      </svg>
    )
  }

  if (name === 'camera') {
    return (
      <svg className={rootClass} viewBox="0 0 120 92" aria-hidden="true">
        <path
          className="find-icon-path"
          pathLength="1"
          style={pathStyle(delay)}
          d="M18 34h28l8-12h32l8 12h28a8 8 0 0 1 8 8v34a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V42a8 8 0 0 1 8-8z"
        />
        <path
          className="find-icon-path"
          pathLength="1"
          style={pathStyle(delay + 0.14)}
          d="M76 56a18 18 0 1 0-36 0a18 18 0 1 0 36 0"
        />
        <path
          className="find-icon-path find-icon-detail"
          pathLength="1"
          style={pathStyle(delay + 0.24)}
          d="M66 56a8 8 0 1 0-16 0a8 8 0 1 0 16 0"
        />
      </svg>
    )
  }

  if (name === 'photo') {
    return (
      <svg className={rootClass} viewBox="0 0 110 110" aria-hidden="true">
        <path
          className="find-icon-path"
          pathLength="1"
          style={pathStyle(delay)}
          d="M16 24h78a10 10 0 0 1 10 10v42a10 10 0 0 1-10 10H16a10 10 0 0 1-10-10V34a10 10 0 0 1 10-10z"
        />
        <path
          className="find-icon-path find-icon-detail"
          pathLength="1"
          style={pathStyle(delay + 0.1)}
          d="M6 34l18-12M104 34l-18-12"
        />
        <circle
          className="find-icon-path find-icon-detail"
          pathLength="1"
          style={pathStyle(delay + 0.18)}
          cx="34"
          cy="40"
          r="7"
        />
        <path
          className="find-icon-path"
          pathLength="1"
          style={pathStyle(delay + 0.26)}
          d="M12 78l24-22 18 14 16-12 28 20"
        />
      </svg>
    )
  }

  return (
    <svg className={rootClass} viewBox="0 0 110 110" aria-hidden="true">
      <g className="find-aperture-spin" style={active ? { animationDelay: `${delay + 0.5}s` } : undefined}>
        <circle className="find-icon-path" pathLength="1" style={pathStyle(delay)} cx="55" cy="55" r="34" />
        <path
          className="find-icon-path"
          pathLength="1"
          style={pathStyle(delay + 0.08)}
          d="M55 21l10 18H45L55 21zm28 14l-8 16-16-8 16-8 8 16zm14 28l-18 10V49l18 10zm-14 28l-8-16 16-8 8 16-16 8zm-28 14l-10-18h20L55 89zm-28-14l8-16 16 8-16 8-8-16zm-14-28l18-10v20l-18-10z"
        />
        <circle
          className="find-icon-path find-icon-detail"
          pathLength="1"
          style={pathStyle(delay + 0.2)}
          cx="55"
          cy="55"
          r="10"
        />
      </g>
    </svg>
  )
}
