import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

type Props = {
  children: ReactNode
  home?: boolean
  /** Full-page brand mesh gradient (like the video hero). */
  mesh?: boolean
}

export function PageShell({ children, home = false, mesh = false }: Props) {
  const location = useLocation()

  useEffect(() => {
    const id = location.hash.replace('#', '')
    if (!id) {
      window.scrollTo(0, 0)
      return
    }
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
    return () => window.clearTimeout(timer)
  }, [location.pathname, location.hash])

  const rootClass = [home ? 'app home-app' : 'app', mesh ? 'app-mesh' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClass}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
