import { MediaGallery } from '../components/gallery/MediaGallery'
import { PageShell } from '../components/layout/PageShell'
import { ProcessSteps } from '../components/process/ProcessSteps'
import { Recommendations } from '../components/recommendations/Recommendations'
import { Cta } from '../components/ui/Cta'
import { businessContent as c } from '../data/business'

export function BusinessPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <div className="wrap">
          <h1>{c.hero.title}</h1>
          <p className="lead">{c.hero.lead}</p>
        </div>
      </section>

      <section className="blk">
        <div className="wrap why-grid">
          {c.value.map((item) => (
            <div key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="blk alt">
        <div className="wrap">
          <h2>{c.whyNow.title}</h2>
          <div className="why-row">
            {c.whyNow.items.map((item) => (
              <div className="why-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blk">
        <div className="wrap">
          <p className="lead">{c.envelope.intro}</p>
          <div className="pillars">
            {c.envelope.items.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blk alt" id="works">
        <div className="wrap">
          <MediaGallery title={c.worksTitle} />
        </div>
      </section>

      <section className="blk" id="reviews">
        <div className="wrap">
          <Recommendations title={c.recommendationsTitle} items={c.recommendations} />
        </div>
      </section>

      <section className="blk alt" id="how">
        <div className="wrap">
          <ProcessSteps title={c.process.title} intro={c.process.intro} steps={c.process.steps} />
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
