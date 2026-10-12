import { useEffect, useLayoutEffect, useMemo, useRef, useState, type TransitionEvent } from 'react'
import { useInView } from '../../motion/useInView'
import { useReducedMotion } from '../../motion/useReducedMotion'
import { RevealHeading } from '../motion/RevealHeading'

type Rec = { name: string; text: string; image?: string }

type Props = {
  title: string
  items: Rec[]
  /** פותח את הרשימה מהפריט הזה, ואז ממשיך באותו סדר וחוזר להתחלה. */
  startIndex?: number
  /** @deprecated ignored — carousel uses all items */
  limit?: number
}

const DESKTOP_VISIBLE = 3
const HOLD_MS = 5000
const MOBILE_MQ = '(max-width: 860px)'

function OutlineQuote({ className, glyph }: { className: string; glyph: string }) {
  return (
    <svg className={className} viewBox="68 14 82 78" fill="none" aria-hidden="true">
      <text
        x="110"
        y="128"
        textAnchor="middle"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.25"
        strokeLinejoin="round"
        fontFamily="'Arial Black', Impact, sans-serif"
        fontSize="140"
      >
        {glyph}
      </text>
    </svg>
  )
}

function RecCard({ item }: { item: Rec }) {
  return (
    <article className="rec-card">
      <OutlineQuote className="rec-q rec-q-open" glyph="”" />
      <p>{item.text}</p>
      <OutlineQuote className="rec-q rec-q-close" glyph="“" />
      <div className="rec-by">
        {item.image ? (
          <img src={item.image} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="rec-by-placeholder" aria-hidden="true" />
        )}
        <strong>{item.name}</strong>
      </div>
    </article>
  )
}

function rotateFrom(items: Rec[], startIndex: number): Rec[] {
  if (items.length === 0) return items
  const n = ((startIndex % items.length) + items.length) % items.length
  if (n === 0) return items
  return [...items.slice(n), ...items.slice(0, n)]
}

function useVisibleCount() {
  const [count, setCount] = useState(DESKTOP_VISIBLE)

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const apply = () => setCount(mq.matches ? 1 : DESKTOP_VISIBLE)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return count
}

export function Recommendations({ title, items, startIndex = 0 }: Props) {
  const reduceMotion = useReducedMotion()
  const { ref, visible } = useInView<HTMLDivElement>({ threshold: 0.05, rootMargin: '0px 0px -5% 0px' })
  const viewportRef = useRef<HTMLDivElement>(null)
  const ordered = useMemo(() => rotateFrom(items, startIndex), [items, startIndex])
  const visibleCount = useVisibleCount()
  const canSlide = ordered.length > visibleCount
  const trackItems = useMemo(
    () => (canSlide ? [...ordered, ...ordered.slice(0, visibleCount)] : ordered),
    [ordered, canSlide, visibleCount],
  )
  const [index, setIndex] = useState(0)
  const [step, setStep] = useState(0)
  const [rowHeight, setRowHeight] = useState(0)
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    setIndex(0)
    setAnimate(true)
  }, [ordered, visibleCount])

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const measure = () => {
      const track = viewport.querySelector<HTMLElement>('.rec-track')
      const cards = [...viewport.querySelectorAll<HTMLElement>('.rec-card')]
      const card = cards[0]
      if (!card || !track) return
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
      setStep(card.getBoundingClientRect().width + gap)

      cards.forEach((entry) => {
        entry.style.minHeight = ''
      })
      const heights = cards.map((entry) => entry.offsetHeight)
      const nextHeight = Math.max(...heights.slice(index, index + visibleCount), 0)
      setRowHeight(nextHeight)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [trackItems, visibleCount, index])

  useEffect(() => {
    if (animate) return
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setAnimate(true))
    })
    return () => window.cancelAnimationFrame(frame)
  }, [animate])

  useEffect(() => {
    if (!visible || reduceMotion || !canSlide) return

    const id = window.setInterval(() => {
      setAnimate(true)
      setIndex((current) => current + 1)
    }, HOLD_MS)

    return () => window.clearInterval(id)
  }, [visible, reduceMotion, canSlide])

  const handleTrackEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'transform' || event.target !== event.currentTarget) return
    if (index < ordered.length) return
    setAnimate(false)
    setIndex(0)
  }

  return (
    <div className="rec-block" ref={ref}>
      <RevealHeading>{title}</RevealHeading>
      {ordered.length === 0 ? (
        <div className="missing-block" role="status">
          המלצות לתחום זה יתווספו בהמשך.
        </div>
      ) : reduceMotion ? (
        <div className="rec-grid rec-grid-motion is-in">
          {ordered.map((entry, i) => (
            <RecCard key={`${entry.name}-${i}`} item={entry} />
          ))}
        </div>
      ) : (
        <div
          className={
            visible ? 'rec-carousel rec-carousel-motion is-in' : 'rec-carousel rec-carousel-motion'
          }
          aria-live="polite"
        >
          <div
            className="rec-viewport"
            ref={viewportRef}
            style={rowHeight ? { height: rowHeight } : undefined}
          >
            <div
              className={animate ? 'rec-track' : 'rec-track is-instant'}
              style={{ transform: step ? `translate3d(${index * step}px, 0, 0)` : undefined }}
              onTransitionEnd={handleTrackEnd}
            >
              {trackItems.map((entry, i) => (
                <RecCard key={`${entry.name}-${i}`} item={entry} />
              ))}
            </div>
          </div>
          {canSlide ? (
            <div className="rec-carousel-dots" aria-hidden="true">
              {ordered.map((entry, i) => (
                <span
                  key={`rec-dot-${entry.name}-${i}`}
                  className={i === index % ordered.length ? 'rec-carousel-dot is-active' : 'rec-carousel-dot'}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
