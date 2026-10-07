import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { prefersReducedMotion } from '../../motion/useReducedMotion'

type Props = {
  children: ReactNode
}

export function PageTransition({ children }: Props) {
  const { pathname } = useLocation()
  const [phase, setPhase] = useState<'enter' | 'idle'>('enter')

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase('idle')
      return
    }
    setPhase('enter')
    const t = window.setTimeout(() => setPhase('idle'), 480)
    return () => window.clearTimeout(t)
  }, [pathname])

  return (
    <div
      key={pathname}
      className={phase === 'enter' ? 'page-transition is-entering' : 'page-transition'}
      data-path={pathname}
    >
      {children}
    </div>
  )
}
