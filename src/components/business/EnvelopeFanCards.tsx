import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from '../../motion/useReducedMotion'

type Item = { title: string; text: string }

type Props = {
  items: Item[]
  active: boolean
}

const HOLD_CLOSED_MS = 3000

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function EnvelopeFanCards({ items, active }: Props) {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const [lifted, setLifted] = useState<number | null>(null)
  const [openAmount, setOpenAmount] = useState(0)
  const mid = (items.length - 1) / 2

  useEffect(() => {
    if (reduceMotion) {
      setOpenAmount(1)
      return
    }
    if (!active) {
      setOpenAmount(0)
      return
    }

    let unlocked = false
    let unlockScroll = 0
    let maxOpen = 0
    let frame = 0
    let timer = 0

    const measure = () => {
      if (!unlocked) {
        setOpenAmount(0)
        return
      }
      const vh = window.innerHeight || 1
      const span = Math.max(vh * 0.32, 160)
      const next = clamp((window.scrollY - unlockScroll) / span, 0, 1)
      maxOpen = Math.max(maxOpen, next)
      setOpenAmount((prev) => (Math.abs(prev - maxOpen) < 0.008 ? prev : maxOpen))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        measure()
      })
    }

    // Stay fully closed for 3s after the section is on screen.
    timer = window.setTimeout(() => {
      unlocked = true
      unlockScroll = window.scrollY
      measure()
    }, HOLD_CLOSED_MS)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [active, reduceMotion])

  const opened = openAmount > 0.04

  return (
    <div
      className={opened ? 'envelope-fan is-open' : 'envelope-fan'}
      aria-label="מעטפת השירות"
      ref={rootRef}
      style={{ '--fan-open': openAmount } as CSSProperties}
    >
      <div className="envelope-fan-stage">
        {items.map((item, index) => {
          const i = index - mid
          const absI = Math.abs(i)
          const isLifted = !reduceMotion && opened && lifted === index

          return (
            <article
              key={item.title}
              className={
                isLifted
                  ? `envelope-fan-card tone-${index % 4} is-lifted`
                  : `envelope-fan-card tone-${index % 4}`
              }
              style={
                {
                  '--i': i,
                  '--abs-i': absI,
                  '--stagger': absI,
                  '--z': isLifted ? 60 : Math.round(20 - absI * 4),
                } as CSSProperties
              }
              onMouseEnter={() => setLifted(index)}
              onMouseLeave={() => setLifted(null)}
              onFocus={() => setLifted(index)}
              onBlur={() => setLifted(null)}
              tabIndex={0}
            >
              <span className="envelope-fan-num" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
