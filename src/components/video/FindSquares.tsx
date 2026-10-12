import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../motion/useReducedMotion'
import { FindCategoryIcon, type FindCategoryIconName } from './FindCategoryIcon'

type Category = {
  icon: string
  title: string
  text: string
}

type Props = {
  categories: Category[]
  iconsActive: boolean
}

function pagesOf(categories: Category[]) {
  return categories.length ? [categories] : []
}

/** All category squares in one row. */
export function FindSquares({ categories, iconsActive }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const pages = pagesOf(categories)

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!section || !pin || !wrap || !track) return

    let index = 0
    let offset = 0
    let animToken = 0
    let coolUntil = 0
    let lockY = 0
    let snapping = false
    let parked = false
    let gestureUntil = 0

    const pageCount = () => track.querySelectorAll<HTMLElement>('.find-scroll-page').length

    const sizePages = () => {
      const width = wrap.clientWidth
      track.querySelectorAll<HTMLElement>('.find-scroll-page').forEach((page) => {
        page.style.flex = '0 0 auto'
        page.style.width = `${width}px`
      })
    }

    const stride = () => {
      const page = track.querySelector<HTMLElement>('.find-scroll-page')
      return page?.getBoundingClientRect().width ?? wrap.clientWidth
    }

    const maxShift = () => Math.max(track.scrollWidth - wrap.clientWidth, 0)

    const maxIndex = () => Math.max(pageCount() - 1, 0)

    const native = () => prefersReducedMotion()

    const enabled = () => !native() && maxIndex() > 0 && maxShift() > 8

    const anchorY = () => {
      const header = 88
      const room = window.innerHeight - header
      return Math.max(header, header + (room - pin.offsetHeight) / 2)
    }

    const scrollInstant = (top: number) => {
      const root = document.documentElement
      const previous = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      snapping = true
      window.scrollTo(0, top)
      snapping = false
      root.style.scrollBehavior = previous
    }

    const render = (x: number) => {
      offset = x
      track.style.transform = `translate3d(${-x}px, 0, 0)`
    }

    const hold = () => {
      lockY = Math.max(0, window.scrollY + pin.getBoundingClientRect().top - anchorY())
      if (Math.abs(window.scrollY - lockY) > 1) scrollInstant(lockY)
      lockY = window.scrollY
    }

    const goTo = (next: number) => {
      const limit = maxIndex()
      next = Math.min(limit, Math.max(0, next))
      const target = Math.min(next * stride(), maxShift())
      if (next === index && Math.abs(offset - target) < 1) return
      index = next
      const from = offset
      const token = ++animToken
      const duration = prefersReducedMotion() ? 0 : 460
      const start = performance.now()
      coolUntil = start + Math.max(duration, 500)

      const step = (now: number) => {
        if (token !== animToken) return
        const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration)
        const eased = 1 - (1 - t) ** 3
        render(from + (target - from) * eased)
        if (Math.abs(window.scrollY - lockY) > 1) scrollInstant(lockY)
        if (t < 1) requestAnimationFrame(step)
      }

      requestAnimationFrame(step)
    }

    const pinNear = () => {
      const pinTop = pin.getBoundingClientRect().top
      const anchor = anchorY()
      return { pinTop, anchor, near: pinTop <= anchor + 110 && pinTop >= anchor - 80 }
    }

    const onWheel = (event: WheelEvent) => {
      if (!enabled()) return
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      const down = event.deltaY > 0
      const now = performance.now()
      const { near } = pinNear()

      if (now < coolUntil) {
        if (near) event.preventDefault()
        return
      }

      if (!near) {
        parked = false
        return
      }

      const leavingDown = down && index >= maxIndex()
      const leavingUp = !down && index <= 0
      if (leavingDown || leavingUp) {
        parked = false
        return
      }

      if (!parked || now < gestureUntil) {
        parked = true
        gestureUntil = now + 320
        event.preventDefault()
        hold()
        return
      }

      event.preventDefault()
      hold()
      gestureUntil = now + 520
      goTo(index + (down ? 1 : -1))
    }

    const onScroll = () => {
      if (native()) return
      if (snapping) return
      if (performance.now() < coolUntil) {
        if (Math.abs(window.scrollY - lockY) > 1) scrollInstant(lockY)
        return
      }

      const pinTop = pin.getBoundingClientRect().top
      if (pinTop > window.innerHeight || pinTop < -pin.offsetHeight) {
        parked = false
        if (pinTop > window.innerHeight && index !== 0) {
          index = 0
          render(0)
        }
      }
    }

    let touchStart = 0
    let touchUsed = false
    const onTouchStart = (event: TouchEvent) => {
      touchStart = event.touches[0]?.clientY ?? 0
      touchUsed = false
    }
    const onTouchMove = (event: TouchEvent) => {
      if (!enabled() || touchUsed) return
      const y = event.touches[0]?.clientY ?? touchStart
      if (Math.abs(touchStart - y) < 28) return
      const down = touchStart - y > 0
      const { near } = pinNear()
      if (!near) return
      if ((down && index >= maxIndex()) || (!down && index <= 0)) return
      event.preventDefault()
      touchUsed = true
      hold()
      goTo(index + (down ? 1 : -1))
    }

    const sync = () => {
      section.classList.toggle('is-native', native())
      if (native()) {
        track.style.transform = ''
        return
      }
      sizePages()
      const limit = maxIndex()
      if (index > limit) index = limit
      render(Math.min(index * stride(), maxShift()))
    }

    sync()

    const observer = new ResizeObserver(() => {
      sync()
    })
    observer.observe(track)
    observer.observe(wrap)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      animToken += 1
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [categories.length])

  return (
    <div className="find-scroll" ref={sectionRef}>
      <div className="find-scroll-pin" ref={pinRef}>
        <div className="find-scroll-viewport" ref={wrapRef}>
          <div className="find-scroll-track" ref={trackRef}>
            {pages.map((page) => (
              <div className="find-scroll-page" key={page.map((cat) => cat.title).join('|')}>
                {page.map((cat, index) => (
                  <article className="find-square" key={cat.title}>
                    <FindCategoryIcon
                      name={cat.icon as FindCategoryIconName}
                      active={iconsActive}
                      delay={index * 0.1}
                    />
                    <h3>{cat.title}</h3>
                    <p>{cat.text}</p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
