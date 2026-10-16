import { useState } from 'react'
import { RevealHeading } from '../motion/RevealHeading'

type Item = { title: string; text: string }

type Props = {
  title: string
  items: Item[]
  active: boolean
}

function WhyCheckMark() {
  return (
    <span className="why-open-check" aria-hidden="true">
      <svg viewBox="0 0 72 72" focusable="false">
        <circle className="why-open-check-ring" cx="36" cy="36" r="30" />
        <path
          className="why-open-check-mark"
          d="M20 37.5c2.8 3.6 8.6 12.8 14.8 17.6 1.2 0.9 2.6 0.35 3.3-0.9C46.2 41.5 54.6 27.2 64 14"
          pathLength={1}
        />
      </svg>
    </span>
  )
}

export function StickyWhySection({ title, items, active }: Props) {
  const [open, setOpen] = useState(0)

  function toggle(index: number) {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (finePointer) return
    setOpen((current) => (current === index ? -1 : index))
  }

  return (
    <div className={`why-open${active ? ' is-in' : ''}`}>
      <RevealHeading className="why-open-title">{title}</RevealHeading>
      <div
        className="why-open-strip"
        onMouseLeave={() => {
          if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            setOpen(0)
          }
        }}
      >
        {items.map((item, index) => {
          const isActive = open === index
          return (
            <article
              className={isActive ? 'why-open-pane is-active' : 'why-open-pane'}
              key={item.title}
              tabIndex={0}
              onMouseEnter={() => setOpen(index)}
              onFocus={() => setOpen(index)}
              onClick={() => toggle(index)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return
                event.preventDefault()
                setOpen((current) => (current === index ? -1 : index))
              }}
            >
              <WhyCheckMark />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
