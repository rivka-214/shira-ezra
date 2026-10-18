import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'shira-cookie-consent'
const DELAY_MS = 60_000

export function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {
      /* show after delay even if storage is blocked */
    }

    const timer = window.setTimeout(() => setOpen(true), DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {
      /* ignore */
    }
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="cookie-banner" role="dialog" aria-label="הודעת עוגיות">
      <p className="cookie-banner-copy">
        האתר משתמש בעוגיות בסיסיות ובשירותי צד ג׳ (כמו YouTube) לשיפור החוויה.{' '}
        <Link to="/privacy">מדיניות פרטיות</Link>
      </p>
      <button type="button" className="btn btn-lime cookie-banner-btn" onClick={accept}>
        הבנתי
      </button>
    </div>
  )
}
