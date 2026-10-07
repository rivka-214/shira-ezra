import type { CSSProperties } from 'react'

export type FindCategoryIconName = 'film' | 'camera' | 'photo' | 'aperture'

type Props = {
  name: FindCategoryIconName
  active?: boolean
  delay?: number
}

function pathStyle(delay: number) {
  return { '--draw-delay': `${delay}s` } as CSSProperties
}

export function FindCategoryIcon({ name, active = false, delay = 0 }: Props) {
  const rootClass = active ? 'find-icon is-active' : 'find-icon'

  if (name === 'film') {
    const hole = (x: number, y: number) =>
      `M${x + 2} ${y}h5a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z`
    const topHoles = [18, 33, 48, 63, 78].map((x) => hole(x, 17)).join('')
    const bottomHoles = [18, 33, 48, 63, 78].map((x) => hole(x, 88)).join('')

    return (
      <svg className={`${rootClass} find-icon--film`} viewBox="0 0 110 110" aria-hidden="true">
        <path
          className="find-icon-path find-icon-film-outer"
          style={pathStyle(delay)}
          d="M20 10h70a12 12 0 0 1 12 12v66a12 12 0 0 1-12 12H20a12 12 0 0 1-12-12V22a12 12 0 0 1 12-12z"
        />
        <path
          className="find-icon-path find-icon-film-frames"
          style={pathStyle(delay + 0.12)}
          d="M22 30h30a6 6 0 0 1 6 6v38a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6zm36 0h30a6 6 0 0 1 6 6v38a6 6 0 0 1-6 6H58a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6z"
        />
        <path
          className="find-icon-path find-icon-detail"
          style={pathStyle(delay + 0.22)}
          d={topHoles}
        />
        <path
          className="find-icon-path find-icon-detail"
          style={pathStyle(delay + 0.3)}
          d={bottomHoles}
        />
      </svg>
    )
  }

  if (name === 'camera') {
    return (
      <svg className={`${rootClass} find-icon--camera`} viewBox="0 0 110 110" aria-hidden="true">
        <path
          className="find-icon-path find-icon-camera-body"
          style={pathStyle(delay)}
          d="M18 74V48a8 8 0 0 1 8-8h13l9-16h22l9 16h13a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8z"
        />
        <circle
          className="find-icon-path find-icon-camera-lens"
          style={pathStyle(delay + 0.12)}
          cx="55"
          cy="58"
          r="18"
        />
        <circle
          className="find-icon-path find-icon-detail"
          style={pathStyle(delay + 0.22)}
          cx="55"
          cy="58"
          r="11"
        />
        <circle
          className="find-icon-path find-icon-detail"
          style={pathStyle(delay + 0.3)}
          cx="77"
          cy="42"
          r="3.5"
        />
      </svg>
    )
  }

  if (name === 'photo') {
    return (
      <svg className={`${rootClass} find-icon--photo`} viewBox="0 0 110 110" aria-hidden="true">
        <path
          className="find-icon-path find-icon-photo-outer"
          style={pathStyle(delay)}
          d="M18 14h74a12 12 0 0 1 12 12v68a12 12 0 0 1-12 12H18a12 12 0 0 1-12-12V26a12 12 0 0 1 12-12z"
        />
        <path
          className="find-icon-path find-icon-detail find-icon-photo-inner"
          style={pathStyle(delay + 0.1)}
          d="M24 22H86V72H24V22z"
        />
        <circle
          className="find-icon-path find-icon-detail"
          style={pathStyle(delay + 0.18)}
          cx="34"
          cy="34"
          r="5.5"
        />
        <path
          className="find-icon-path find-icon-detail"
          style={pathStyle(delay + 0.24)}
          d="M58 38a4.5 4.5 0 0 1 9 0 4 4 0 0 1 8.5 0 4 4 0 0 1 8.5 0"
        />
        <path
          className="find-icon-path find-icon-detail"
          style={pathStyle(delay + 0.3)}
          d="M28 72L40 54L52 72M46 72L58 58L82 72"
        />
      </svg>
    )
  }

  const cx = 55
  const cy = 55
  const outerR = 34
  const innerR = 28.5
  const hexR = 10.5
  const blades = Array.from({ length: 6 }, (_, i) => {
    const tip = ((i * 60 - 90) * Math.PI) / 180
    const base = ((i * 60 - 90 - 30) * Math.PI) / 180
    return {
      x1: cx + innerR * Math.cos(base),
      y1: cy + innerR * Math.sin(base),
      x2: cx + hexR * Math.cos(tip),
      y2: cy + hexR * Math.sin(tip),
    }
  })

  return (
    <svg className={rootClass} viewBox="0 0 110 110" aria-hidden="true">
      <circle
        className="find-icon-path"
        style={pathStyle(delay)}
        cx={cx}
        cy={cy}
        r={outerR}
      />
      <circle
        className="find-icon-path find-icon-aperture-ring"
        style={pathStyle(delay + 0.1)}
        cx={cx}
        cy={cy}
        r={innerR}
      />
      {blades.map((b, i) => (
        <line
          key={i}
          className="find-icon-path"
          style={pathStyle(delay + 0.2 + i * 0.07)}
          x1={b.x1}
          y1={b.y1}
          x2={b.x2}
          y2={b.y2}
        />
      ))}
    </svg>
  )
}
