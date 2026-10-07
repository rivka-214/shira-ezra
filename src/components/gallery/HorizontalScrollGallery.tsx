import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { prefersReducedMotion } from '../../motion/useReducedMotion'

type Props = {
  children: ReactNode
  className?: string
}

/** Vertical scroll drives horizontal movement (desktop); swipe on mobile */
export function HorizontalScrollGallery({ children, className = '' }: Props) {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const pin = pinRef.current
    const track = trackRef.current
    if (!pin || !track) return
    if (prefersReducedMotion()) return

    let frame = 0
    const update = () => {
      frame = 0
      const pinRect = pin.getBoundingClientRect()
      const vh = window.innerHeight
      const trackWidth = track.scrollWidth
      const viewWidth = pin.clientWidth
      const maxShift = Math.max(trackWidth - viewWidth, 0)
      if (maxShift <= 0) {
        setOffset(0)
        return
      }
      const start = vh * 0.85
      const end = -pinRect.height * 0.25
      const span = start - end
      const raw = (start - pinRect.top) / Math.max(span, 1)
      const t = Math.min(1, Math.max(0, raw))
      setOffset(-t * maxShift)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [children])

  return (
    <div className={`h-scroll-section${className ? ` ${className}` : ''}`}>
      <div className="h-scroll-pin" ref={pinRef}>
        <div className="h-scroll-track-wrap">
          <div
            className="h-scroll-track"
            ref={trackRef}
            style={{ transform: `translate3d(${offset}px, 0, 0)` }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
