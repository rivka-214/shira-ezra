import { useLayoutEffect, useRef, useState } from 'react'
import { RevealHeading } from '../motion/RevealHeading'
import { FadeUp } from '../motion/FadeUp'
import { useInView } from '../../motion/useInView'

type Step = { title: string; text: string }

type Props = {
  title: string
  intro?: string
  steps: Step[]
  variant?: 'column' | 'row'
  /** Larger staged steps (events page) */
  eventsStyle?: boolean
}

export function ProcessSteps({ title, intro, steps, variant = 'column', eventsStyle = false }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const { ref: blockRef, visible: blockIn } = useInView<HTMLDivElement>({ threshold: 0.12 })
  const showRail = variant === 'column' && steps.length > 1 && !eventsStyle
  const timeline = showRail

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const rail = railRef.current
    if (!wrap || !rail || !showRail) return

    const place = () => {
      const nums = wrap.querySelectorAll<HTMLElement>('.num')
      const first = nums[0]
      const last = nums[nums.length - 1]
      if (!first || !last) return
      const wrapBox = wrap.getBoundingClientRect()
      const a = first.getBoundingClientRect()
      const b = last.getBoundingClientRect()
      const top = a.top + a.height / 2 - wrapBox.top
      const height = b.top + b.height / 2 - wrapBox.top - top
      const center = a.left + a.width / 2 - wrapBox.left
      rail.style.top = `${top}px`
      rail.style.height = `${Math.max(height, 0)}px`
      rail.style.left = `${center - 1}px`
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      place()
      setProgress(1)
      setActiveIndex(steps.length - 1)
      window.addEventListener('resize', place)
      return () => window.removeEventListener('resize', place)
    }

    let frame = 0
    const update = () => {
      frame = 0
      place()
      const rect = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.8
      const end = vh * 0.35
      const distance = Math.max(rect.height + start - end, 1)
      const next = Math.min(1, Math.max(0, (start - rect.top) / distance))
      setProgress((prev) => (Math.abs(prev - next) < 0.008 ? prev : next))

      const items = wrap.querySelectorAll<HTMLElement>('.steps li')
      let active = 0
      items.forEach((li, i) => {
        const r = li.getBoundingClientRect()
        if (r.top < vh * 0.62) active = i
      })
      setActiveIndex(active)
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
  }, [showRail, steps.length])

  const processClass = [
    'process',
    `process-${variant}`,
    timeline ? 'process-timeline' : '',
    eventsStyle ? 'process-events' : '',
    blockIn ? 'is-in' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={processClass} ref={blockRef}>
      <RevealHeading>{title}</RevealHeading>
      {intro ? (
        <FadeUp delay={0.06}>
          <p className="lead">{intro}</p>
        </FadeUp>
      ) : null}
      <div className="steps-wrap" ref={wrapRef}>
        {showRail ? (
          <div className="steps-rail" ref={railRef} aria-hidden="true">
            <div className="steps-rail-fill" style={{ transform: `scaleY(${progress})` }} />
          </div>
        ) : null}
        <ol className="steps">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className={
                timeline
                  ? i < activeIndex
                    ? 'is-done'
                    : i === activeIndex
                      ? 'is-active'
                      : ''
                  : ''
              }
              style={eventsStyle ? { ['--step-delay' as string]: `${0.12 + i * 0.18}s` } : undefined}
            >
              <span className="num">
                {eventsStyle ? String(i + 1).padStart(2, '0') : i + 1}
              </span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
