import { useEffect, useId, useRef, useState } from 'react'
import { MediaGallery } from '../components/gallery/MediaGallery'
import { CameraSketch } from '../components/video/CameraSketch'
import { PageShell } from '../components/layout/PageShell'
import { Recommendations } from '../components/recommendations/Recommendations'
import { Cta } from '../components/ui/Cta'
import { videoContent as c } from '../data/video'

export function VideoPage() {
  const dividerId = `vd-${useId().replace(/:/g, '')}`
  const findRef = useRef<HTMLElement>(null)
  const whyRef = useRef<HTMLElement>(null)
  const emphasisRef = useRef<HTMLParagraphElement>(null)
  const [findIn, setFindIn] = useState(false)
  const [whyIn, setWhyIn] = useState(false)

  useEffect(() => {
    const section = findRef.current
    const emphasis = emphasisRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFindIn(true)
      return
    }

    let heroDone = false
    let visible = false
    let started = false

    const tryStart = () => {
      if (started || !heroDone || !visible) return
      started = true
      setFindIn(true)
      observer.disconnect()
    }

    const markHeroDone = () => {
      heroDone = true
      tryStart()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting)
        tryStart()
      },
      { threshold: 0.12 },
    )

    observer.observe(section)
    emphasis?.addEventListener('animationend', markHeroDone)
    const fallback = window.setTimeout(markHeroDone, 1700)

    return () => {
      observer.disconnect()
      emphasis?.removeEventListener('animationend', markHeroDone)
      window.clearTimeout(fallback)
    }
  }, [])

  useEffect(() => {
    const section = whyRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWhyIn(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setWhyIn(true)
        observer.disconnect()
      },
      { threshold: 0.2 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <PageShell>
      <section className="page-hero video-hero">
        <div className="wrap video-hero-inner">
          <h1 className="video-hero-title">{c.hero.title}</h1>
          <CameraSketch />
          <div className="video-hero-copy">
            <p className="sub">{c.hero.subtitle}</p>
            {c.hero.lead.map((p) => (
              <p className="lead" key={p.slice(0, 24)}>
                {p}
              </p>
            ))}
          </div>
          <p className="video-hero-emphasis" ref={emphasisRef}>{c.hero.emphasis}</p>
        </div>
      </section>

      <div className="video-hero-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 104" preserveAspectRatio="none">
          <defs>
            <linearGradient id={dividerId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6ee943" />
              <stop offset="18%" stopColor="#63d17a" />
              <stop offset="55%" stopColor="#6762eb" />
              <stop offset="78%" stopColor="#301ab3" />
              <stop offset="100%" stopColor="#3e099e" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${dividerId})`}
            d="M0 48 C20 48 40 63 60 63 C80 63 100 74 120 74 C140 74 160 76 180 76 C200 76 220 70 240 70 C260 70 280 60 300 60 C320 60 340 48 360 48 C380 48 400 35 420 35 C440 35 460 25 480 25 C500 25 520 20 540 20 C560 20 580 21 600 21 C620 21 640 32 660 32 C680 32 700 47 720 47 C740 47 760 63 780 63 C800 63 820 74 840 74 C860 74 880 76 900 76 C920 76 940 70 960 70 C980 70 1000 60 1020 60 C1040 60 1060 48 1080 48 C1100 48 1120 35 1140 35 C1160 35 1180 25 1200 25 C1220 25 1240 20 1260 20 C1280 20 1300 21 1320 21 C1340 21 1360 32 1380 32 C1400 32 1420 47 1440 47 L1440 56 C1420 56 1400 41 1380 41 C1360 41 1340 30 1320 30 C1300 30 1280 29 1260 29 C1240 29 1220 34 1200 34 C1180 34 1160 44 1140 44 C1120 44 1100 57 1080 57 C1060 57 1040 69 1020 69 C1000 69 980 79 960 79 C940 79 920 85 900 85 C880 85 860 83 840 83 C820 83 800 72 780 72 C760 72 740 56 720 56 C700 56 680 41 660 41 C640 41 620 30 600 30 C580 30 560 29 540 29 C520 29 500 34 480 34 C460 34 440 44 420 44 C400 44 380 57 360 57 C340 57 320 69 300 69 C280 69 260 79 240 79 C220 79 200 85 180 85 C160 85 140 83 120 83 C100 83 80 72 60 72 C40 72 20 57 0 57 Z"
          />
        </svg>
      </div>

      <section className={findIn ? 'blk find-here is-in' : 'blk find-here'} ref={findRef}>
        <div className="wrap">
          <h2 className="find-rise">{c.findHere.title}</h2>
          <p className="find-rise" style={{ animationDelay: '0.14s' }}>
            {c.findHere.intro}
          </p>
          <div className="cats">
            {c.findHere.categories.map((cat, index) => (
              <div key={cat.title}>
                <h3 className="find-rise" style={{ animationDelay: `${0.26 + index * 0.14}s` }}>
                  {cat.title}
                </h3>
                <p className="find-rise" style={{ animationDelay: `${0.36 + index * 0.14}s` }}>
                  {cat.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blk alt" id="works">
        <div className="wrap">
          <MediaGallery
            title={c.produced.title}
            note={c.produced.examplesNote}
            videos={c.produced.videos}
            moreLabel={c.produced.examplesTitle}
          />
        </div>
      </section>

      <section className="blk reviews-band" id="reviews">
        <div className="wrap">
          <Recommendations title={c.recommendationsTitle} items={c.recommendations} limit={3} />
        </div>
      </section>

      <section className={whyIn ? 'blk alt why-block is-in' : 'blk alt why-block'} id="why" ref={whyRef}>
        <div className="wrap">
          <h2 className="find-rise">{c.why.title}</h2>
          <div className="why-grid">
            {c.why.items.map((item, index) => (
              <div key={item.title}>
                <h3 className="find-rise" style={{ animationDelay: `${0.16 + index * 0.12}s` }}>
                  {item.title}
                </h3>
                <p className="find-rise" style={{ animationDelay: `${0.26 + index * 0.12}s` }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>{c.cta.title}</h2>
          <Cta href="#contact">{c.cta.button}</Cta>
        </div>
      </section>
    </PageShell>
  )
}
