import { useEffect, useMemo, useState } from 'react'
import { useInView } from '../../motion/useInView'
import { useReducedMotion } from '../../motion/useReducedMotion'
import { RevealHeading } from '../motion/RevealHeading'

type Rec = { name: string; text: string; image?: string }

type Props = {
  title: string
  items: Rec[]
  /** @deprecated ignored — carousel uses all items */
  limit?: number
}

const PAGE_SIZE = 3
const ROTATE_MS = 6000

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

export function Recommendations({ title, items }: Props) {
  const reduceMotion = useReducedMotion()
  const { ref, visible } = useInView<HTMLDivElement>({ threshold: 0.05, rootMargin: '0px 0px -5% 0px' })
  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(items.length / PAGE_SIZE)),
    [items.length],
  )
  const [page, setPage] = useState(0)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    setPage(0)
    setSlide(0)
  }, [items.length])

  useEffect(() => {
    if (pageCount <= 1 || reduceMotion) return

    const advance = () => {
      setPage((p) => (p + 1) % pageCount)
      setSlide((s) => s + 1)
    }

    const id = window.setInterval(advance, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [pageCount, reduceMotion])

  const activePage = useMemo(() => {
    const start = page * PAGE_SIZE
    return items.slice(start, start + PAGE_SIZE)
  }, [items, page])

  return (
    <div className="rec-block" ref={ref}>
      <RevealHeading>{title}</RevealHeading>
      {items.length === 0 ? (
        <div className="missing-block" role="status">
          המלצות לתחום זה יתווספו בהמשך.
        </div>
      ) : reduceMotion ? (
        <div className="rec-grid rec-grid-motion is-in">
          {items.map((entry, i) => (
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
          <div className="rec-grid rec-grid-page" key={`rec-slide-${slide}`}>
            {activePage.map((entry, i) => (
              <RecCard key={`${entry.name}-${page}-${i}`} item={entry} />
            ))}
          </div>
          {pageCount > 1 ? (
            <div className="rec-carousel-dots" aria-hidden="true">
              {Array.from({ length: pageCount }, (_, i) => (
                <span
                  key={`rec-dot-${i}`}
                  className={i === page ? 'rec-carousel-dot is-active' : 'rec-carousel-dot'}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
