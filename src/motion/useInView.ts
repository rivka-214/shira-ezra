import { useEffect, useRef, useState, type RefObject } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

type Options = {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useInView<T extends Element = HTMLElement>(
  options: Options = {},
): { ref: RefObject<T | null>; visible: boolean; ratio: number } {
  const { threshold = 0.15, rootMargin = '0px', once = true } = options
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)
  const [ratio, setRatio] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (prefersReducedMotion()) {
      setVisible(true)
      setRatio(1)
      return
    }

    let done = false

    const reveal = (r: number) => {
      if (once && done) return
      done = true
      setVisible(true)
      setRatio(r)
    }

    const ratioInView = () => {
      const rect = node.getBoundingClientRect()
      if (rect.height <= 0) return 0
      const vh = window.innerHeight || document.documentElement.clientHeight
      const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
      if (visiblePx <= 0) return 0
      return Math.min(1, visiblePx / rect.height)
    }

    const syncIfVisible = () => {
      if (once && done) return
      const r = ratioInView()
      if (r >= threshold) {
        reveal(r)
        observer.disconnect()
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setRatio(entry.intersectionRatio)
        const inBand = entry.isIntersecting && entry.intersectionRatio >= threshold
        if (inBand) {
          reveal(entry.intersectionRatio)
          if (once) observer.disconnect()
        } else if (!once) {
          done = false
          setVisible(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)

    // After route transitions / layout, IO can miss the first in-view frame.
    let raf1 = 0
    let raf2 = 0
    raf1 = requestAnimationFrame(() => {
      syncIfVisible()
      raf2 = requestAnimationFrame(syncIfVisible)
    })

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return
      done = false
      setVisible(false)
      observer.observe(node)
      requestAnimationFrame(syncIfVisible)
    }
    window.addEventListener('pageshow', onPageShow)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [threshold, rootMargin, once])

  return { ref, visible, ratio }
}
