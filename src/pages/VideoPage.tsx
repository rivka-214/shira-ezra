import { useEffect, useRef, useState } from 'react'
import { MediaGallery } from '../components/gallery/MediaGallery'
import { FindCategoryIcon, type FindCategoryIconName } from '../components/video/FindCategoryIcon'
import { PageShell } from '../components/layout/PageShell'
import { WaveDecor } from '../components/layout/WaveDecor'
import { Recommendations } from '../components/recommendations/Recommendations'
import { StickyWhySection } from '../components/video/StickyWhySection'
import { Cta } from '../components/ui/Cta'
import { videoContent as c } from '../data/video'
import { useInView } from '../motion/useInView'

export function VideoPage() {
  const { ref: findRef, visible: findIn } = useInView<HTMLElement>({ threshold: 0.08 })
  const [findIconsDraw, setFindIconsDraw] = useState(false)
  const whyRef = useRef<HTMLElement>(null)
  const [whyIn, setWhyIn] = useState(false)

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
        <div className="wrap">
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
              <p className="video-hero-emphasis">
                <span className="video-hero-emphasis-hook">{c.hero.emphasisHook}</span>
                <span className="video-hero-emphasis-tail">{c.hero.emphasisTail}</span>
              </p>
            </div>
            <WaveDecor variant="hero" />
          </div>
        </div>
      </section>

      <section className={findIn ? 'blk find-here is-in' : 'blk find-here'} ref={findRef}>
        <div className="wrap">
          <h2 className="find-rise">{c.findHere.title}</h2>
          <p className="find-rise" style={{ animationDelay: '0.14s' }}>
            {c.findHere.intro}
          </p>
          <div className="cats">
            {c.findHere.categories.map((cat, index) => (
              <div className="find-card" key={cat.title}>
                <FindCategoryIcon
                  name={cat.icon as FindCategoryIconName}
                  active={findIconsDraw}
                  delay={index * 0.1}
                />
                <div className="find-card-copy">
                  <h3 className="find-rise" style={{ animationDelay: `${0.26 + index * 0.14}s` }}>
                    {cat.title}
                  </h3>
                  <p className="find-rise" style={{ animationDelay: `${0.36 + index * 0.14}s` }}>
                    {cat.text}
                  </p>
                </div>
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

      <section
        className={whyIn ? 'blk alt why-block is-in' : 'blk alt why-block'}
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
