import { useEffect, useState, type CSSProperties, type RefObject } from 'react'
import { useReducedMotion } from '../../motion/useReducedMotion'

type Item = { title: string; text: string }

type Props = {
  items: Item[]
  /** Scroll pin that drives open 0→1; page content below only after fully open. */
  pinRef: RefObject<HTMLElement | null>
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function EnvelopeFanCards({ items, pinRef }: Props) {
  const reduceMotion = useReducedMotion()
  const [lifted, setLifted] = useState<number | null>(null)
  const [openAmount, setOpenAmount] = useState(0)
  const mid = (items.length - 1) / 2

  useEffect(() => {
    if (reduceMotion || window.matchMedia('(max-width: 860px)').matches) {
      setOpenAmount(1)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const pin = pinRef.current
      if (!pin) return
      const rect = pin.getBoundingClientRect()
      const range = Math.max(pin.offsetHeight - window.innerHeight, 1)
      // 0 while approaching; 1 only after scrolling through the full pin runway.
      const next = clamp(-rect.top / range, 0, 1)
      setOpenAmount((prev) => (Math.abs(prev - next) < 0.004 ? prev : next))
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
  }, [pinRef, reduceMotion])

  const opened = openAmount > 0.04

  return (
    <div
      className={opened ? 'envelope-fan is-open' : 'envelope-fan'}
      aria-label="מעטפת השירות"
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
