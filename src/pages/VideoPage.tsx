import { useEffect, useRef, useState } from 'react'
import { MediaGallery } from '../components/gallery/MediaGallery'
import { FindSquares } from '../components/video/FindSquares'
import { PageShell } from '../components/layout/PageShell'
import { Recommendations } from '../components/recommendations/Recommendations'
import { StickyWhySection } from '../components/video/StickyWhySection'
import { Cta } from '../components/ui/Cta'
import { videoContent as c } from '../data/video'
import { useInView } from '../motion/useInView'

export function VideoPage() {
  const { ref: findRef, visible: findIn } = useInView<HTMLElement>({ threshold: 0.08 })
  const [findIconsDraw, setFindIconsDraw] = useState(false)
  const whyRef = useRef<HTMLElement>(null)
  const emphasisRef = useRef<HTMLParagraphElement>(null)
  const [whyIn, setWhyIn] = useState(false)
  const [emphasisIn, setEmphasisIn] = useState(false)

  useEffect(() => {
    if (!findIn) {
      setFindIconsDraw(false)
      return
    }
    let raf1 = 0
    let raf2 = 0
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setFindIconsDraw(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [findIn])

  useEffect(() => {
    const node = emphasisRef.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEmphasisIn(true)
      return
    }

    const reveal = () => {
      if (window.scrollY < 16) return
      const rect = node.getBoundingClientRect()
      const viewH = window.innerHeight
      const arrived = rect.top < viewH * 0.82 && rect.bottom > viewH * 0.12
      if (arrived) setEmphasisIn(true)
    }

    reveal()
    window.addEventListener('scroll', reveal, { passive: true })
    window.addEventListener('resize', reveal)
    return () => {
      window.removeEventListener('scroll', reveal)
      window.removeEventListener('resize', reveal)
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
      <section className="page-hero-shell video-hero-shell">
        <div className="page-hero-panel video-hero-panel video-hero blue-wave-panel">
          <div className="video-hero-inner">
            <h1 className="video-hero-title">{c.hero.title}</h1>
            <div className="video-hero-copy">
              <p className="sub">{c.hero.subtitle}</p>
              {c.hero.lead.map((p) => (
                <p className="lead" key={p.slice(0, 24)}>
                  {p}
                </p>
              ))}
            </div>
            <p
              className={emphasisIn ? 'video-hero-emphasis is-in' : 'video-hero-emphasis'}
              ref={emphasisRef}
            >
              <span className="video-hero-emphasis-hook">{c.hero.emphasisHook}</span>
              <span className="video-hero-emphasis-tail">{c.hero.emphasisTail}</span>
            </p>
          </div>
        </div>
        <svg
          className="video-hero-wave"
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 0h1440v58c-80 4-200 16-340 14-180-2-300-22-460-36C460 20 280 16 140 28 60 36 20 46 0 52V0z" />
        </svg>
      </section>

      <section className={findIn ? 'blk find-here is-in' : 'blk find-here'} ref={findRef}>
        <div className="wrap">
          <h2 className="find-rise find-heading">{c.findHere.title}</h2>
          <p className="find-rise find-intro" style={{ animationDelay: '0.14s' }}>
            {c.findHere.intro}
          </p>
          <FindSquares categories={c.findHere.categories} iconsActive={findIconsDraw} />
        </div>
      </section>

      <section className="blk works-produced" id="works">
        <div className="wrap">
          <MediaGallery
            title={c.produced.title}
            note={c.produced.examplesNote}
            videos={c.produced.videos}
            previewCount={c.produced.videos.length}
          />
        </div>
      </section>

      <section
        className={whyIn ? 'blk why-block is-in' : 'blk why-block'}
        id="why"
        ref={whyRef}
      >
        <div className="wrap">
          <StickyWhySection title={c.why.title} items={c.why.items} active={whyIn} />
        </div>
      </section>

      <section className="blk reviews-close" id="reviews">
        <div className="wrap">
          <Recommendations title={c.recommendationsTitle} items={c.recommendations} />
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
