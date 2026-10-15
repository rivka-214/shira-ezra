import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useReducedMotion } from '../../motion/useReducedMotion'

const PLAY_MS = 5600
const STATIC_MS = 2200

function ConstructionNoticePlay() {
  const reduce = useReducedMotion()
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setGone(true), reduce ? STATIC_MS : PLAY_MS)
    return () => window.clearTimeout(timer)
  }, [reduce])

  if (gone) return null

  return (
    <div
      className={reduce ? 'construction-notice is-static' : 'construction-notice'}
      role="status"
      aria-live="polite"
    >
      <div className="construction-notice-crane">
        <div className="construction-notice-sign">
          <img
            src="/images/under-construction.png"
            alt=""
            width={544}
            height={524}
            decoding="async"
          />
          <p className="construction-notice-text">
            <span>האתר עדיין</span>
            <span>בבניה</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export function ConstructionNotice() {
  const { pathname } = useLocation()
  return <ConstructionNoticePlay key={pathname} />
}
