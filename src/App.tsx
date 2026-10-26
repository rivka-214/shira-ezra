import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AccessibilityWidget } from './components/layout/AccessibilityWidget'
import { ConstructionNotice } from './components/layout/ConstructionNotice'
import { CookieBanner } from './components/layout/CookieBanner'
import { PageTransition } from './components/motion/PageTransition'
import { BusinessPage } from './pages/BusinessPage'
import { EventsPage } from './pages/EventsPage'
import { HomePage } from './pages/HomePage'
import { PrivacyPage } from './pages/PrivacyPage'
import { VideoPage } from './pages/VideoPage'

function RouteWipe() {
  const { pathname } = useLocation()
  const prev = useRef(pathname)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (prev.current === pathname) return
    prev.current = pathname
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setTick((n) => n + 1)
  }, [pathname])

  if (tick === 0) return null
  return <div key={tick} className="route-wipe" aria-hidden="true" />
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteWipe />
      <ConstructionNotice />
      <CookieBanner />
      <AccessibilityWidget />
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  )
}
