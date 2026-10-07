import { useEffect, useRef, useState } from 'react'
import { MediaGallery } from '../components/gallery/MediaGallery'
import { PageShell } from '../components/layout/PageShell'
import { RevealHeading } from '../components/motion/RevealHeading'
import { EventPackages } from '../components/packages/EventPackages'
import { ProcessSteps } from '../components/process/ProcessSteps'
import { Recommendations } from '../components/recommendations/Recommendations'
import { Cta } from '../components/ui/Cta'
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
            <RevealHeading as="h1">{c.hero.title}</RevealHeading>
            <p className="sub">{c.hero.subtitle}</p>
            {c.hero.lead.map((p, index) => (
              <p
                className="lead events-hero-lead"
                key={p.slice(0, 24)}
                style={{ ['--lead-delay' as string]: `${0.2 + index * 0.08}s` }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="blk events-section" id="works">
        <div className="wrap">
          <MediaGallery title={c.worksTitle} scrollGallery />
        </div>
      </section>

      <section className="blk alt events-section" id="how">
        <div className="wrap">
          <ProcessSteps
            title={c.process.title}
            intro={c.process.intro}
            steps={c.process.steps}
            variant="column"
            eventsStyle
          />
        </div>
      </section>

      <section className="blk events-section">
        <div className="wrap">
          <EventPackages title={c.packages.title} items={c.packages.items} centered />
        </div>
      </section>

      <section className="blk reviews-close events-section" id="reviews">
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
