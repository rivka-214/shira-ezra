import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'
import { prefersReducedMotion } from '../../motion/useReducedMotion'

type SequenceApi = {
  register: (id: string, order: number) => void
  unregister: (id: string) => void
  progressFor: (order: number) => number
}

const DrawSequenceContext = createContext<SequenceApi | null>(null)

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

type SequenceProps = {
  children: ReactNode
  className?: string
}

/**
 * Scroll-locked sequence: each DrawBehindLine paints in order.
 * Page only scrolls past once every line is fully drawn.
 */
export function ScrollDrawSequence({ children, className }: SequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<Map<string, number>>(new Map())
  const totalRef = useRef(0)
  const progressRef = useRef(0)
  const [, bump] = useState(0)

  const api = useMemo<SequenceApi>(
    () => ({
      register(id, order) {
        linesRef.current.set(id, order)
        totalRef.current = Math.max(totalRef.current, order + 1)
        bump((n) => n + 1)
      },
      unregister(id) {
        linesRef.current.delete(id)
        const orders = [...linesRef.current.values()]
        totalRef.current = orders.length ? Math.max(...orders) + 1 : 0
        bump((n) => n + 1)
      },
      progressFor(order) {
        return clamp(progressRef.current - order, 0, 1)
      },
    }),
    [],
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const fills = () =>
      Array.from(root.querySelectorAll<HTMLElement>('[data-draw-fill]'))

    const paint = () => {
      const total = Math.max(totalRef.current, 1)
      const p = progressRef.current
      fills().forEach((fill) => {
        const order = Number(fill.dataset.drawOrder || 0)
        const local = clamp(p - order, 0, 1)
        fill.style.setProperty('--draw', local.toFixed(4))
        fill.parentElement?.classList.toggle('is-drawn', local >= 0.999)
      })
      root.dataset.drawDone = p >= total - 0.001 ? '1' : '0'
    }

    if (prefersReducedMotion()) {
      progressRef.current = 99
      paint()
      return
    }

    progressRef.current = 0
    paint()

    const hero = root.closest('.lines-hero') as HTMLElement | null
    let lockY = 0
    let held = false
    let touchY: number | null = null

    const scrollInstant = (top: number) => {
      const doc = document.documentElement
      const previous = doc.style.scrollBehavior
      doc.style.scrollBehavior = 'auto'
      window.scrollTo(0, top)
      doc.style.scrollBehavior = previous
    }

    const heroTop = () => {
      if (!hero) return 0
      return Math.max(0, window.scrollY + hero.getBoundingClientRect().top)
    }

    const heroInPlay = () => {
      if (!hero) return false
      const rect = hero.getBoundingClientRect()
      return rect.top <= 80 && rect.bottom > window.innerHeight * 0.42
    }

    const hold = () => {
      lockY = heroTop()
      if (Math.abs(window.scrollY - lockY) > 1) scrollInstant(lockY)
      held = true
    }

    const release = () => {
      held = false
    }

    const maxProgress = () => Math.max(totalRef.current, 1)

    const advance = (deltaPx: number) => {
      // ~one line per ~700px of wheel — slow, readable draw
      const next = clamp(progressRef.current + deltaPx / 700, 0, maxProgress())
      progressRef.current = next
      paint()
      return next
    }

    const onWheel = (event: WheelEvent) => {
      if (!heroInPlay()) {
        release()
        return
      }

      const p = progressRef.current
      const max = maxProgress()
      const down = event.deltaY > 0
      const up = event.deltaY < 0

      if (down && p < max) {
        event.preventDefault()
        hold()
        advance(Math.abs(event.deltaY))
        return
      }

      if (up && p > 0 && p < max) {
        event.preventDefault()
        hold()
        advance(-Math.abs(event.deltaY))
        return
      }

      if (down && p >= max) {
        release()
        return
      }

      if (up && p <= 0) release()
    }

    const onScroll = () => {
      if (!held) return
      if (progressRef.current < maxProgress() && heroInPlay()) {
        if (Math.abs(window.scrollY - lockY) > 1) scrollInstant(lockY)
      }
    }

    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? null
    }

    const onTouchMove = (event: TouchEvent) => {
      if (touchY == null || !heroInPlay()) return
      const y = event.touches[0]?.clientY
      if (y == null) return
      const dy = touchY - y
      touchY = y
      const p = progressRef.current
      const max = maxProgress()

      if (dy > 0 && p < max) {
        event.preventDefault()
        hold()
        advance(dy * 1.8)
        return
      }
      if (dy < 0 && p > 0 && p < max) {
        event.preventDefault()
        hold()
        advance(dy * 1.8)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    // Re-paint when lines register
    paint()

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  // Re-run paint when line count changes after register
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.querySelectorAll<HTMLElement>('[data-draw-fill]').forEach((fill) => {
      const order = Number(fill.dataset.drawOrder || 0)
      const local = clamp(progressRef.current - order, 0, 1)
      fill.style.setProperty('--draw', local.toFixed(4))
    })
  })

  return (
    <DrawSequenceContext.Provider value={api}>
      <div className={['draw-sequence', className].filter(Boolean).join(' ')} ref={rootRef}>
        {children}
      </div>
    </DrawSequenceContext.Provider>
  )
}

type LineProps = {
  order: number
  as?: ElementType
  className?: string
  children: ReactNode
}

/** One text line with a thin lime underline that draws in on scroll. */
export function DrawBehindLine({ order, as: Tag = 'p', className, children }: LineProps) {
  const api = useContext(DrawSequenceContext)
  const id = useRef(`draw-${order}-${Math.random().toString(36).slice(2, 7)}`).current

  useEffect(() => {
    if (!api) return
    api.register(id, order)
    return () => api.unregister(id)
  }, [api, id, order])

  const classes = ['draw-behind', 'draw-underline', className].filter(Boolean).join(' ')

  return (
    <Tag className={classes} style={{ '--draw': 0 } as CSSProperties}>
      <span className="draw-behind-text">{children}</span>
      <svg
        className="draw-behind-fill draw-underline-stroke"
        data-draw-fill
        data-draw-order={order}
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          pathLength={100}
          d="M0 7.5 C 30 3.2, 55 10.8, 80 6.2 S 130 2.8, 155 7.8 S 185 10.2, 200 6.5"
        />
      </svg>
    </Tag>
  )
}

/** @deprecated use ScrollDrawSequence + DrawBehindLine */
export function ScrollDrawHighlight({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <ScrollDrawSequence>
      <DrawBehindLine order={0} className={className}>
        {children}
      </DrawBehindLine>
    </ScrollDrawSequence>
  )
}
