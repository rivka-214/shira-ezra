import { MediaGallery } from '../components/gallery/MediaGallery'
import { PageShell } from '../components/layout/PageShell'
import { EventPackages } from '../components/packages/EventPackages'
import { ProcessSteps } from '../components/process/ProcessSteps'
import { Recommendations } from '../components/recommendations/Recommendations'
import { Cta } from '../components/ui/Cta'
import { eventsContent as c } from '../data/events'

export function EventsPage() {
  return (
    <PageShell>
      <section className="page-hero-shell events-hero-shell">
        <div className="wrap events-section">
          <div className="page-hero-panel events-hero-panel">
            <h1>{c.hero.title}</h1>
            <p className="sub">{c.hero.subtitle}</p>
            {c.hero.lead.map((p) => (
              <p className="lead events-hero-lead" key={p.slice(0, 24)}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="blk events-section" id="works">
        <div className="wrap">
          <MediaGallery title={c.worksTitle} />
        </div>
      </section>

      <section className="blk alt events-section" id="how">
        <div className="wrap">
          <ProcessSteps
            title={c.process.title}
            intro={c.process.intro}
            steps={c.process.steps}
            variant="column"
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
