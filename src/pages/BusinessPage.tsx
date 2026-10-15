import { useState, type ReactNode } from 'react'
import { EnvelopeFanCards } from '../components/business/EnvelopeFanCards'
import { useInView } from '../motion/useInView'
import { MediaGallery } from '../components/gallery/MediaGallery'
import { PageShell } from '../components/layout/PageShell'
import { WaveDecor } from '../components/layout/WaveDecor'
import { ProcessSteps } from '../components/process/ProcessSteps'
import { Recommendations } from '../components/recommendations/Recommendations'
import { Cta } from '../components/ui/Cta'
import { LinesHero } from '../components/video/LinesHero'
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
  const whyNow = useInView<HTMLElement>({ threshold: 0.18 })
  const envelope = useInView<HTMLElement>({ threshold: 0.28 })
  const [flippedCard, setFlippedCard] = useState<number | null>(null)

  function toggleCard(index: number) {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (finePointer) return
    setFlippedCard((current) => (current === index ? null : index))
  }

  return (
    <PageShell>
      <section className="page-hero-shell biz-hero-shell">
        <div className="page-hero-panel biz-hero-panel blue-wave-panel">
          <div className="biz-hero-inner">
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
          <WaveDecor variant="hero" />
        </div>
      </section>

      <section
        className={whyNow.visible ? 'blk alt biz-why-section is-in' : 'blk alt biz-why-section'}
        ref={whyNow.ref}
      >
        <div className="wrap">
          <h2 className="biz-why-heading find-rise">{c.whyNow.title}</h2>
          <div className="biz-why-frame">
            <div className="biz-why-row">
              {c.whyNow.items.map((item, index) => (
                <div
                  className={
                    flippedCard === index
                      ? 'biz-why-card find-rise is-flipped'
                      : 'biz-why-card find-rise'
                  }
                  key={item.title}
                  tabIndex={0}
                  style={{ animationDelay: `${0.12 + index * 0.18}s` }}
                  onClick={() => toggleCard(index)}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return
                    event.preventDefault()
                    setFlippedCard((current) => (current === index ? null : index))
                  }}
                >
                  <div className="biz-why-scene">
                    <div className="biz-why-card-inner">
                      <div className="biz-why-face biz-why-front">
                        <h3>{item.title}</h3>
                      </div>
                      <div className="biz-why-face biz-why-back">
                        <p>{item.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div ref={envelope.ref}>
        <LinesHero
          className={
            envelope.visible
              ? 'lines-hero-section biz-envelope why-block is-in'
              : 'lines-hero-section biz-envelope why-block'
          }
          contentClassName="lines-hero-section-content"
          label="מעטפת השירות"
          interactive
        >
          <div className="wrap">
            <p className="lead biz-envelope-intro find-rise">
              {c.envelope.intro.split('\n').map((line) => (
                <span className="biz-envelope-line" key={line}>
                  {line}
                </span>
              ))}
            </p>
            <EnvelopeFanCards items={c.envelope.items} active={envelope.visible} />
          </div>
        </LinesHero>
      </div>

      <section className="blk biz-how" id="how">
        <div className="wrap">
          <ProcessSteps title={c.process.title} intro={c.process.intro} steps={c.process.steps} />
        </div>
      </section>

      <section className="blk" id="works">
        <div className="wrap">
          <MediaGallery title={c.worksTitle} videos={c.works} previewCount={c.works.length} />
        </div>
      </section>

      <section className="blk reviews-close biz-reviews" id="reviews">
        <div className="wrap">
          <Recommendations
            title={c.recommendationsTitle}
            items={c.recommendations}
            startIndex={c.recommendationStart}
          />
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
