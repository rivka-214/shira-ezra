import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
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

function useReveal(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

export function BusinessPage() {
  const whyNow = useReveal(0.18)
  const envelope = useReveal(0.16)

  return (
    <PageShell>
      <section className="page-hero-shell biz-hero-shell">
        <div className="wrap">
          <div className="page-hero-panel biz-hero-panel">
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
          </div>
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
                  className="biz-why-card find-rise"
                  key={item.title}
                  style={{ animationDelay: `${0.12 + index * 0.18}s` }}
                >
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className={envelope.visible ? 'blk biz-envelope why-block is-in' : 'blk biz-envelope why-block'}
        ref={envelope.ref}
      >
        <div className="wrap">
          <p className="lead biz-envelope-intro find-rise">{c.envelope.intro}</p>
          <div className="why-grid">
            {c.envelope.items.map((item, index) => (
              <div key={item.title}>
                <h3 className="find-rise" style={{ animationDelay: `${0.14 + index * 0.1}s` }}>
                  {item.title}
                </h3>
                <p className="find-rise" style={{ animationDelay: `${0.24 + index * 0.1}s` }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blk alt" id="how">
        <div className="wrap">
          <ProcessSteps title={c.process.title} intro={c.process.intro} steps={c.process.steps} />
        </div>
      </section>

      <section className="blk" id="works">
        <div className="wrap">
          <MediaGallery title={c.worksTitle} />
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
