import { useEffect, useRef } from 'react'
import { RevealHeading } from '../motion/RevealHeading'

type Item = { title: string; text: string }

type Props = {
  title: string
  items: Item[]
  active: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function soft(t: number) {
  return t * t * (3 - 2 * t)
}

function WhyCheck() {
  return (
    <span className="why-check" aria-hidden="true">
      <svg viewBox="0 0 86 86" focusable="false">
        <path
          d="M16 46.5c3.2 4.4 10.6 16.2 18.4 22.2 1.5 1.15 3.3.4 4.15-1.15C48.2 54.2 59.4 35.6 72 18"
          pathLength={1}
        />
      </svg>
    </span>
  )
}

export function StickyWhySection({ title, items, active }: Props) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const rows = Array.from(list.querySelectorAll<HTMLElement>('.why-sticky-panel'))
    if (!rows.length) return

    const paint = (row: HTMLElement, rowIn: number, draw: number, scale: number) => {
      row.style.setProperty('--row-in', rowIn.toFixed(3))
      const mark = row.querySelector<HTMLElement>('.why-check')
      mark?.style.setProperty('--check-draw', draw.toFixed(3))
      mark?.style.setProperty('--check-scale', scale.toFixed(3))
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rows.forEach((row) => paint(row, 1, 1, 1))
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight
      const firstTop = rows[0].getBoundingClientRect().top
      const step = Math.min(156, Math.max(108, vh * 0.17))
      const origin = vh * 0.8
      const span = step * 0.78

      rows.forEach((row, index) => {
        const local = clamp((origin - firstTop - index * step * 0.86) / span, 0, 1)
        const eased = soft(local)
        const draw = soft(clamp((local - 0.12) / 0.82, 0, 1))
        paint(row, eased, draw, 0.97 + draw * 0.03)
      })
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items])

  return (
    <div className={`why-sticky${active ? ' is-in' : ''}`}>
      <div className="why-sticky-side">
        <RevealHeading className="why-sticky-title">{title}</RevealHeading>
      </div>
      <div className="why-sticky-panels" ref={listRef}>
        {items.map((item) => (
          <div className="why-sticky-panel" key={item.title}>
            <WhyCheck />
            <div className="why-sticky-copy">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
