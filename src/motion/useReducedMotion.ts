import { useEffect, useState } from 'react'

export const A11Y_MOTION_EVENT = 'shira-a11y-motion'

export function prefersReducedMotion() {
  const forced =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('a11y-motion')
  if (forced) return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useReducedMotion() {
  const [reduce, setReduce] = useState(prefersReducedMotion)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduce(prefersReducedMotion())
    mq.addEventListener('change', onChange)
    window.addEventListener(A11Y_MOTION_EVENT, onChange)
    return () => {
      mq.removeEventListener('change', onChange)
      window.removeEventListener(A11Y_MOTION_EVENT, onChange)
    }
  }, [])

  return reduce
}
