import { useEffect, useRef, useState } from 'react'
import { EnvelopeFanCards } from '../components/business/EnvelopeFanCards'
import { MediaGallery } from '../components/gallery/MediaGallery'
import { LinesHero } from '../components/video/LinesHero'
import { HeroUnderline } from '../components/video/HeroUnderline'
import { PageShell } from '../components/layout/PageShell'
import { Recommendations } from '../components/recommendations/Recommendations'
import { StickyWhySection } from '../components/video/StickyWhySection'
import { Cta } from '../components/ui/Cta'
import { videoContent as c } from '../data/video'
import { useInView } from '../motion/useInView'

export function VideoPage() {
  const findSection = useInView<HTMLElement>({ threshold: 0.08 })
  const findPinRef = useRef<HTMLElement | null>(null)
  const whyRef = useRef<HTMLElement>(null)
  const [whyIn, setWhyIn] = useState(false)

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

  const findCards = c.findHere.categories.map(({ title, text }) => ({ title, text }))

  return (
    <PageShell>
      <LinesHero contentClassName="video-hero" tone="mesh" label="עולם של וידאו">
        <div className="video-hero-inner">
          <h1 className="video-hero-title">{c.hero.title}</h1>
          <div className="video-hero-copy draw-sequence">
            <HeroUnderline index={0} underline className="sub">
              {c.hero.subtitle}
            </HeroUnderline>
            {c.hero.lead.map((p, i) => (
              <HeroUnderline index={1 + i} className="lead" key={p.slice(0, 24)}>
                {p}
              </HeroUnderline>
            ))}
            <HeroUnderline
              index={1 + c.hero.lead.length}
              underline
              className="video-hero-emphasis-hook draw-emphasis"
            >
              {c.hero.emphasisHook}
            </HeroUnderline>
            <HeroUnderline
              index={2 + c.hero.lead.length}
              underline
              className="video-hero-emphasis-tail draw-emphasis"
            >
              {c.hero.emphasisTail}
            </HeroUnderline>
          </div>
        </div>
      </LinesHero>

      <section
        className={
          findSection.visible
            ? 'envelope-scroll-pin find-here-fan why-block is-in'
            : 'envelope-scroll-pin find-here-fan why-block'
        }
        ref={(node) => {
          findSection.ref.current = node
          findPinRef.current = node
        }}
      >
        <div className="envelope-scroll-sticky">
          <LinesHero
            className="lines-hero-section"
            contentClassName="lines-hero-section-content"
            label="מה תמצאו כאן"
            interactive
            cover
            showLines
          >
            <div className="wrap">
              <div className="find-here-copy">
                <h2 className="find-rise find-heading find-heading-fan">{c.findHere.title}</h2>
                <HeroUnderline
                  underline
                  inView
                  className="find-rise find-intro find-intro-fan"
                  style={{ animationDelay: '0.14s' }}
                >
                  {c.findHere.intro}
                </HeroUnderline>
              </div>
              <EnvelopeFanCards items={findCards} pinRef={findPinRef} />
            </div>
          </LinesHero>
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

      <section className="cta-band cta-on-white">
        <div className="wrap">
          <h2>{c.cta.title}</h2>
          <Cta href="#contact">{c.cta.button}</Cta>
        </div>
      </section>
    </PageShell>
  )
}
