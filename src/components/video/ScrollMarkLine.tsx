import {
  useEffect,
  useMemo,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react'
import { prefersReducedMotion } from '../../motion/useReducedMotion'

type MarkColor = 'lime' | 'blue'

type Props = {
  as?: ElementType
  mark: MarkColor
  className?: string
  children: ReactNode
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function ease(t: number) {
  return t * t * (3 - 2 * t)
}

function splitWords(text: string) {
  return text.split(/(\s+)/).filter((part) => part.length > 0)
}

/** Thin opposite-color bars that draw word-by-word under the line as the user scrolls. */
export function ScrollMarkLine({ as: Tag = 'span', mark, className, children }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const text = typeof children === 'string' ? children : String(children ?? '')
  const parts = useMemo(() => splitWords(text), [text])
  const wordCount = useMemo(
    () => parts.reduce((n, part) => n + (/\S/.test(part) ? 1 : 0), 0),
    [parts],
  )

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const bars = Array.from(node.querySelectorAll<HTMLElement>('[data-word-bar]'))

    const paint = (progress: number) => {
      const spread = progress * wordCount
      bars.forEach((bar, index) => {
        const local = clamp(spread - index, 0, 1)
        bar.style.setProperty('--word-draw', ease(local).toFixed(3))
      })
    }

    if (prefersReducedMotion() || wordCount === 0) {
      paint(1)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight || 1
      const marks = Array.from(
        node.ownerDocument.querySelectorAll<HTMLElement>('.video-hero .scroll-mark'),
      )
      const order = Math.max(0, marks.indexOf(node))
      // Empty on first paint; draws as the page scrolls down, line after line.
      const start = 10 + order * (vh * 0.1)
      const span = vh * 0.26
      const raw = (window.scrollY - start) / Math.max(span, 1)
      paint(clamp(raw, 0, 1))
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
  }, [wordCount])

  const classes = ['scroll-mark', className].filter(Boolean).join(' ')
  let wordIndex = 0

  return (
    <Tag className={classes} data-mark={mark} ref={ref as never}>
      {parts.map((part, i) => {
        if (!/\S/.test(part)) {
          return <span key={`s-${i}`}>{part}</span>
        }
        const index = wordIndex
        wordIndex += 1
        return (
          <span className="scroll-mark-word" key={`w-${index}-${part}`}>
            <span className="scroll-mark-word-text">{part}</span>
            <span className="scroll-mark-bar" data-word-bar aria-hidden="true" />
          </span>
        )
      })}
    </Tag>
  )
}
