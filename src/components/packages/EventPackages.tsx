import { useId, useRef, type CSSProperties, type MouseEvent } from 'react'
import { useInView } from '../../motion/useInView'
import { useReducedMotion } from '../../motion/useReducedMotion'
import { RevealHeading } from '../motion/RevealHeading'

type Pkg = {
  name: string
  badge?: string
  headline?: string
  price?: string
  description?: string
  features: string[]
  bonus?: string[]
}

type Props = {
  title: string
  items: Pkg[]
  centered?: boolean
  closingPrompt?: string
}

const TILT_MAX = 10

function PackageCard({
  pkg,
  index,
  reduceMotion,
}: {
  pkg: Pkg
  index: number
  reduceMotion: boolean
}) {
  const cardRef = useRef<HTMLElement>(null)
  const empty =
    !pkg.headline &&
    !pkg.description &&
    pkg.features.length === 0 &&
    !(pkg.bonus && pkg.bonus.length)

  const resetTilt = () => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--pkg-rx', '0deg')
    card.style.setProperty('--pkg-ry', '0deg')
    card.classList.remove('is-tilting')
  }

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion) return
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const px = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const py = ((event.clientY - rect.top) / rect.height) * 2 - 1
    card.style.setProperty('--pkg-rx', `${(-py * TILT_MAX).toFixed(2)}deg`)
    card.style.setProperty('--pkg-ry', `${(px * TILT_MAX).toFixed(2)}deg`)
    card.classList.add('is-tilting')
  }

  return (
    <article
      className={pkg.badge ? 'pkg-card pkg-card-rich is-featured' : 'pkg-card pkg-card-rich'}
      ref={cardRef}
      style={
        {
          ['--pkg-i' as string]: index,
          ['--pkg-rx' as string]: '0deg',
          ['--pkg-ry' as string]: '0deg',
        } as CSSProperties
      }
      onMouseMove={onMove}
      onMouseLeave={resetTilt}
      onBlur={resetTilt}
    >
              {pkg.badge ? <span className="pkg-badge">{pkg.badge}</span> : null}
              <h3 className="pkg-headline">{pkg.name}</h3>
              {pkg.headline ? <p className="pkg-desc">{pkg.headline}</p> : null}
      {pkg.description ? <p className="pkg-desc">{pkg.description}</p> : null}
      {pkg.features.length > 0 ? (
        <ul className="pkg-features">
          {pkg.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      ) : null}
      {pkg.bonus && pkg.bonus.length > 0 ? (
        <div className="pkg-bonus">
          <span className="pkg-bonus-label">
            <i className="pkg-bonus-mark" aria-hidden="true" />
            בונוס
          </span>
          <ul>
            {pkg.bonus.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {empty ? <p className="muted">חסר מידע — נדרש מהלקוחה</p> : null}
    </article>
  )
}

export function EventPackages({ title, items, centered = false, closingPrompt }: Props) {
  const { ref, visible } = useInView<HTMLDivElement>({ threshold: 0.12 })
  const reduceMotion = useReducedMotion()
  const gradId = useId().replace(/:/g, '')

  return (
    <div className={centered ? 'pkg-block pkg-block-center' : 'pkg-block'} ref={ref}>
      <RevealHeading>{title}</RevealHeading>
      <div
        className={
          visible
            ? 'pkg-grid pkg-grid-events pkg-grid-tilt is-in'
            : 'pkg-grid pkg-grid-events pkg-grid-tilt'
        }
      >
        {items.map((pkg, index) => (
          <PackageCard key={pkg.name} pkg={pkg} index={index} reduceMotion={reduceMotion} />
        ))}
      </div>
      {closingPrompt ? (
        <a
          className={
            reduceMotion ? 'pkg-closing-prompt is-static' : 'pkg-closing-prompt'
          }
          href="#contact"
        >
          <svg
            className="pkg-closing-frame"
            viewBox="0 0 400 72"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`pkg-closing-grad-${gradId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6ee943" />
                <stop offset="40%" stopColor="#63d17a" />
                <stop offset="70%" stopColor="#6762eb" />
                <stop offset="100%" stopColor="#301ab3" />
              </linearGradient>
            </defs>
            <rect
              className="pkg-closing-stroke"
              pathLength={1}
              x="2"
              y="2"
              width="396"
              height="68"
              rx="34"
              ry="34"
              fill="none"
              stroke={`url(#pkg-closing-grad-${gradId})`}
            />
          </svg>
          <span className="pkg-closing-label">{closingPrompt}</span>
        </a>
      ) : null}
    </div>
  )
}
