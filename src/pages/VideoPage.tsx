import { MediaGallery } from '../components/gallery/MediaGallery'
import { PageShell } from '../components/layout/PageShell'
import { Recommendations } from '../components/recommendations/Recommendations'
import { Cta } from '../components/ui/Cta'
import { videoContent as c } from '../data/video'

export function VideoPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <div className="wrap">
          <h1>{c.hero.title}</h1>
          <p className="sub">{c.hero.subtitle}</p>
          {c.hero.lead.map((p) => (
            <p className="lead" key={p.slice(0, 24)}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="blk">
        <div className="wrap">
          <h2>{c.findHere.title}</h2>
          <p>{c.findHere.intro}</p>
          <div className="cats">
            {c.findHere.categories.map((cat) => (
              <div key={cat.title}>
                <h3>{cat.title}</h3>
                <p>{cat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blk alt" id="works">
        <div className="wrap">
          <MediaGallery title={c.produced.title} note={c.produced.examplesNote} />
          <p className="examples-label">{c.produced.examplesTitle}</p>
        </div>
      </section>

      <section className="blk" id="reviews">
        <div className="wrap">
          <Recommendations title={c.recommendationsTitle} items={c.recommendations} />
        </div>
      </section>

      <section className="blk alt" id="why">
        <div className="wrap">
          <h2>{c.why.title}</h2>
          <div className="why-grid">
            {c.why.items.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
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
