import { useLayoutEffect, useRef, useState } from 'react'

type Step = { title: string; text: string }

type Props = {
  title: string
  intro?: string
  steps: Step[]
  variant?: 'column' | 'row'
}

export function ProcessSteps({ title, intro, steps, variant = 'column' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const showRail = variant === 'column' && steps.length > 1

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

  return (
    <div className={`process process-${variant}`}>
      <h2>{title}</h2>
      {intro ? <p className="lead">{intro}</p> : null}
      <div className="steps-wrap" ref={wrapRef}>
        {showRail ? (
          <div className="steps-rail" ref={railRef} aria-hidden="true">
            <div className="steps-rail-fill" style={{ transform: `scaleY(${progress})` }} />
          </div>
        ) : null}
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="num">{i + 1}</span>
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
