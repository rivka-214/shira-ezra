import type { ReactNode } from 'react'
import { MediaGallery } from '../components/gallery/MediaGallery'
import { PageShell } from '../components/layout/PageShell'
import { ProcessSteps } from '../components/process/ProcessSteps'
import { Recommendations } from '../components/recommendations/Recommendations'
import { Cta } from '../components/ui/Cta'
import { businessContent as c } from '../data/business'

const heroHighlights = ['להבליט', 'אמון']

function highlightHero(line: string): ReactNode[] {
  const pattern = new RegExp(`(${heroHighlights.join('|')})`, 'g')
  return line.split(pattern).map((part, index) =>
    heroHighlights.includes(part) ? (
      <span className="biz-em" key={`${part}-${index}`}>
        {part}
      </span>
    ) : (
      part
    ),
  )
}

export function BusinessPage() {
  return (
    <PageShell>
      <section className="page-hero biz-hero">
        <div className="wrap biz-hero-inner">
          <h1 className="biz-hero-title">{c.hero.title}</h1>
          {c.hero.lines.map((line, index) => (
            <p
              className="lead biz-hero-line"
              key={line.slice(0, 24)}
              style={{ animationDelay: `${0.42 + index * 0.28}s` }}
            >
              {highlightHero(line)}
            </p>
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
