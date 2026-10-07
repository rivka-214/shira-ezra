import { useEffect, useState, type RefObject } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

/** 0→1 while `target` travels from below the viewport through its scroll range */
export function useScrollProgress(
  targetRef: RefObject<HTMLElement | null>,
  enabled = true,
): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = targetRef.current
    if (!el || !enabled) return
    if (prefersReducedMotion()) {
      setProgress(0)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.92
      const end = -rect.height * 0.35
      const span = start - end
      const raw = (start - rect.top) / Math.max(span, 1)
      setProgress((prev) => {
        const next = Math.min(1, Math.max(0, raw))
        return Math.abs(prev - next) < 0.004 ? prev : next
      })
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
  }, [targetRef, enabled])

  return progress
}
