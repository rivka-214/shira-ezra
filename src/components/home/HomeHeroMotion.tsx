import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useScrollProgress } from '../../motion/useScrollProgress'
import { useReducedMotion } from '../../motion/useReducedMotion'
import { ScrollCue } from './ScrollCue'

type Props = {
  children: ReactNode
}

export function HomeHeroMotion({ children }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const progress = useScrollProgress(sectionRef, !reduce)

  const videoScale = 1 + progress * 0.07
  const contentY = progress * -28
  const contentScale = 1 - progress * 0.045
  const veilMix = 62 + progress * 18

  return (
    <section
      className="home-hero home-hero-motion"
      ref={sectionRef}
      style={
        reduce
          ? undefined
          : ({
              ['--hero-video-scale' as string]: videoScale,
              ['--hero-content-y' as string]: `${contentY}px`,
              ['--hero-content-scale' as string]: contentScale,
              ['--hero-veil-mix' as string]: `${veilMix}%`,
            } as CSSProperties)
      }
    >
      {children}
      <ScrollCue hidden={progress > 0.12} />
    </section>
  )
}
