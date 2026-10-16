import { useEffect, useRef, useState } from 'react'
import { BlockedStamp } from '../components/events/BlockedStamp'
import { ConfettiBurst } from '../components/events/ConfettiBurst'
import { SpinBookDate } from '../components/events/SpinBookDate'
import { MediaGallery } from '../components/gallery/MediaGallery'
import { PageShell } from '../components/layout/PageShell'
import { RevealHeading } from '../components/motion/RevealHeading'
import { EventPackages } from '../components/packages/EventPackages'
import { ProcessSteps } from '../components/process/ProcessSteps'
import { Recommendations } from '../components/recommendations/Recommendations'
import { Cta } from '../components/ui/Cta'
import { HeroUnderline } from '../components/video/HeroUnderline'
import { SparkTrail } from '../components/video/SparkTrail'
import { eventsContent as c } from '../data/events'

export function EventsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [heroIn, setHeroIn] = useState(false)

  useEffect(() => {
    const panel = heroRef.current
    if (!panel) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHeroIn(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setHeroIn(true)
        observer.disconnect()
      },
      { threshold: 0.25 },
    )
    observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  return (
    <PageShell>
      <ConfettiBurst delayMs={1000} durationMs={6000} />
      <section className="page-hero-shell events-hero-shell">
        <div className="wrap events-section">
          <div
            className={
              heroIn
                ? 'page-hero-panel events-hero-panel events-hero-cinematic is-in'
                : 'page-hero-panel events-hero-panel events-hero-cinematic'
            }
            ref={heroRef}
          >
            <SparkTrail />
            <RevealHeading as="h1">{c.hero.title}</RevealHeading>
            <HeroUnderline index={0} underline className="sub events-hero-sub">
              {c.hero.subtitle}
            </HeroUnderline>
            {c.hero.lead.map((p, index) => {
              const delay = `${0.2 + index * 0.08}s`
              const isMagic = p.includes('מגיע לך ולבתך')
              if (isMagic) {
                return (
                  <HeroUnderline
                    key={p.slice(0, 24)}
                    underline
                    inView
                    index={index}
                    className="lead events-hero-lead"
                    style={{ ['--lead-delay' as string]: delay }}
                  >
                    {p}
                  </HeroUnderline>
                )
              }
              return (
                <p
                  className="lead events-hero-lead"
                  key={p.slice(0, 24)}
                  style={{ ['--lead-delay' as string]: delay }}
                >
                  {p}
                </p>
              )
            })}
          </div>
        </div>
      </section>

      <section className="blk events-section events-works" id="works">
        <div className="wrap events-works-wrap">
          <MediaGallery
            title={c.worksTitle}
            videos={c.works}
            previewCount={c.works.length}
            scrollGallery
          />
          <BlockedStamp />
        </div>
      </section>

      <section className="blk events-section events-how biz-how" id="how">
        <div className="wrap">
          <ProcessSteps
            title={c.process.title}
            subtitle={c.process.subtitle}
            steps={c.process.steps}
            variant="column"
            eventsStyle
          />
        </div>
        <SpinBookDate href="#contact" />
      </section>

      <section className="blk events-section">
        <div className="wrap">
          <EventPackages
            title={c.packages.title}
            items={c.packages.items}
            closingPrompt={c.packages.closingPrompt}
            centered
          />
        </div>
      </section>

      <section className="blk reviews-close events-section" id="reviews">
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
