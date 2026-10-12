import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { prefersReducedMotion } from '../../motion/useReducedMotion'

type Props = {
  children: ReactNode
  className?: string
}

/** Each scroll moves one video. At the end of the row the page scrolls on. */
export function HorizontalScrollGallery({ children, className = '' }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!section || !pin || !wrap || !track) return

    let index = 0
    let offset = 0
    let animating = false
    let animToken = 0
    let lockY = 0
    let held = false
    let gestureUntil = 0

    const maxShift = () => Math.max(track.scrollWidth - wrap.clientWidth, 0)

    const stepSize = () => {
      const item = track.querySelector<HTMLElement>(':scope > *')
      if (!item) return wrap.clientWidth
      const styles = getComputedStyle(track)
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0
      return item.getBoundingClientRect().width + gap
    }

    const maxIndex = () => {
      const step = stepSize()
      const shift = maxShift()
      if (step <= 1 || shift <= 8) return 0
      return Math.ceil(shift / step - 0.02)
    }

    const offsetFor = (next: number) => Math.min(maxShift(), Math.max(0, next) * stepSize())

    const anchorY = () => {
      const header = 88
      const room = window.innerHeight - header
      return Math.max(header, header + (room - pin.offsetHeight) / 2)
    }

    const enabled = () => !prefersReducedMotion() && maxIndex() > 0

    const scrollInstant = (top: number) => {
      const root = document.documentElement
      const previous = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      window.scrollTo(0, top)
      root.style.scrollBehavior = previous
    }

    const applyOffset = (value: number) => {
      offset = value
      const rtl = getComputedStyle(section).direction === 'rtl'
      const x = (rtl ? 1 : -1) * value
      track.style.transform = `translate3d(${x}px, 0, 0)`
    }

    const hold = () => {
      lockY = Math.max(0, window.scrollY + pin.getBoundingClientRect().top - anchorY())
      scrollInstant(lockY)
      held = true
    }

    const syncButtons = () => {
      const prev = prevRef.current
      const next = nextRef.current
      if (!prev || !next) return
      if (section.classList.contains('is-native')) {
        const max = Math.max(wrap.scrollWidth - wrap.clientWidth, 0)
        const idle = max <= 8
        prev.hidden = idle
        next.hidden = idle
        const pos = Math.abs(wrap.scrollLeft)
        prev.disabled = idle || pos <= 8
        next.disabled = idle || pos >= max - 8
        return
      }
      const count = maxIndex()
      const idle = count <= 0
      prev.hidden = idle
      next.hidden = idle
      prev.disabled = index <= 0
      next.disabled = index >= count
    }

    const goTo = (next: number, lock = true) => {
      const count = maxIndex()
      next = Math.max(0, Math.min(count, next))
      if (next === index && !animating) return
      const from = offset
      const to = offsetFor(next)
      index = next
      syncButtons()
      const token = ++animToken
      animating = true
      const start = performance.now()
      const duration = 380

      const frame = (now: number) => {
        if (token !== animToken) return
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - (1 - t) ** 3
        applyOffset(from + (to - from) * eased)
        if (lock && Math.abs(window.scrollY - lockY) > 1) scrollInstant(lockY)
        if (t < 1) {
          requestAnimationFrame(frame)
          return
        }
        applyOffset(to)
        animating = false
        syncButtons()
        if (index <= 0 || index >= maxIndex()) held = false
      }

      requestAnimationFrame(frame)
    }

    const stepBy = (delta: number) => {
      if (section.classList.contains('is-native')) {
        const rtl = getComputedStyle(section).direction === 'rtl'
        wrap.scrollBy({
          left: (rtl ? 1 : -1) * delta * stepSize(),
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        })
        return
      }
      goTo(index + delta, false)
    }

    const syncMode = () => {
      const native = !enabled()
      section.classList.toggle('is-native', native)
      if (native) {
        track.style.transform = ''
        held = false
      }
    }

    const wantsStep = (down: boolean) => {
      if (!enabled()) return false
      const count = maxIndex()
      const pinTop = pin.getBoundingClientRect().top
      const anchor = anchorY()
      const near =
        held ||
        (pinTop <= anchor + 72 && pinTop >= anchor - pin.offsetHeight && pin.getBoundingClientRect().bottom > 64)
      if (!near) return false
      if (down) return index < count
      return index > 0
    }

    const takeStep = (down: boolean) => {
      if (!held) hold()
      const now = performance.now()
      if (now < gestureUntil) {
        gestureUntil = now + 140
        return
      }
      gestureUntil = now + 420
      goTo(index + (down ? 1 : -1))
    }

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      const down = event.deltaY > 0
      if (!wantsStep(down)) {
        if ((down && index >= maxIndex()) || (!down && index <= 0)) held = false
        return
      }
      event.preventDefault()
      takeStep(down)
    }

    let touchStartY = 0
    let touchStepped = false
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0
      touchStepped = false
    }
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? touchStartY
      const delta = touchStartY - y
      if (Math.abs(delta) < 28) return
      const down = delta > 0
      if (!wantsStep(down)) return
      event.preventDefault()
      if (touchStepped) return
      touchStepped = true
      if (!held) hold()
      goTo(index + (down ? 1 : -1))
    }

    const onScroll = () => {
      syncMode()
      if (!enabled()) return
      const count = maxIndex()
      const pinTop = pin.getBoundingClientRect().top
      const anchor = anchorY()
      const blockedDown = index < count && pinTop < anchor - 6
      const blockedUp = index > 0 && pinTop > anchor + 6
      if (animating || held || blockedDown || blockedUp) {
        const nextLock = Math.max(0, window.scrollY + pinTop - anchor)
        if (Math.abs(window.scrollY - nextLock) > 1) {
          lockY = nextLock
          scrollInstant(lockY)
          held = true
        }
      }
    }

    section.style.height = ''
    syncMode()
    applyOffset(0)

    const onPrev = () => stepBy(-1)
    const onNext = () => stepBy(1)
    prevRef.current?.addEventListener('click', onPrev)
    nextRef.current?.addEventListener('click', onNext)

    const observer = new ResizeObserver(() => {
      syncMode()
      if (!enabled()) {
        syncButtons()
        return
      }
      index = Math.min(index, maxIndex())
      applyOffset(offsetFor(index))
      syncButtons()
    })
    observer.observe(track)
    observer.observe(wrap)
    syncButtons()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('resize', onScroll)
    wrap.addEventListener('scroll', syncButtons, { passive: true })

    return () => {
      animToken += 1
      observer.disconnect()
      prevRef.current?.removeEventListener('click', onPrev)
      nextRef.current?.removeEventListener('click', onNext)
      wrap.removeEventListener('scroll', syncButtons)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', onScroll)
    }
  }, [children])

  return (
    <div className={`h-scroll-section${className ? ` ${className}` : ''}`} ref={sectionRef}>
      <div className="h-scroll-pin" ref={pinRef}>
        <button
          type="button"
          className="h-scroll-arrow h-scroll-arrow-prev"
          ref={prevRef}
          aria-label="הדוגמה הקודמת"
          disabled
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M6 3.2 10.8 8 6 12.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="h-scroll-track-wrap" ref={wrapRef}>
          <div className="h-scroll-track" ref={trackRef}>
            {children}
          </div>
        </div>
        <button
          type="button"
          className="h-scroll-arrow h-scroll-arrow-next"
          ref={nextRef}
          aria-label="הדוגמה הבאה"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M10 3.2 5.2 8 10 12.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
