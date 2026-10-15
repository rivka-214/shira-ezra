import { useEffect, useRef, useState } from 'react'
import { MediaGallery } from '../components/gallery/MediaGallery'
import { FindSquares } from '../components/video/FindSquares'
import { LinesHero } from '../components/video/LinesHero'
import {
  DrawBehindLine,
  ScrollDrawSequence,
} from '../components/video/ScrollDrawHighlight'
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

  const leadCount = c.hero.lead.length

  return (
    <PageShell>
      <LinesHero contentClassName="video-hero">
        <div className="video-hero-inner">
          <h1 className="video-hero-title video-hero-title-pill">{c.hero.title}</h1>
          <ScrollDrawSequence className="video-hero-copy">
            <DrawBehindLine order={0} className="sub">
              {c.hero.subtitle}
            </DrawBehindLine>
            {c.hero.lead.map((p, i) => (
              <DrawBehindLine
                order={1 + i}
                className={i === 0 ? 'lead lead-bar' : 'lead'}
                key={p.slice(0, 24)}
              >
                {p}
              </DrawBehindLine>
            ))}
            <DrawBehindLine
              order={1 + leadCount}
              className="video-hero-emphasis-hook draw-emphasis"
            >
              {c.hero.emphasisHook}
            </DrawBehindLine>
            <DrawBehindLine
              order={2 + leadCount}
              className="video-hero-emphasis-tail draw-emphasis"
            >
              {c.hero.emphasisTail}
            </DrawBehindLine>
          </ScrollDrawSequence>
        </div>
      </LinesHero>

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

      <section className="cta-band cta-on-white">
        <div className="wrap">
          <h2>{c.cta.title}</h2>
          <Cta href="#contact">{c.cta.button}</Cta>
        </div>
      </section>
    </PageShell>
  )
}
