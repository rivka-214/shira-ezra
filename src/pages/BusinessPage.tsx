import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { EnvelopeFanCards } from '../components/business/EnvelopeFanCards'
import { useInView } from '../motion/useInView'
import { BlockedStamp, businessBlockedMail } from '../components/events/BlockedStamp'
import { MediaGallery } from '../components/gallery/MediaGallery'
import { PageShell } from '../components/layout/PageShell'
import { ProcessSteps } from '../components/process/ProcessSteps'
import { Recommendations } from '../components/recommendations/Recommendations'
import { Cta } from '../components/ui/Cta'
import { HeroUnderline } from '../components/video/HeroUnderline'
import { LinesHero } from '../components/video/LinesHero'
import { businessContent as c } from '../data/business'

const heroHighlights = ['להבליט', 'אמון']

function BizWhyCheck() {
  return (
    <span className="why-open-check biz-why-check" aria-hidden="true">
      <svg viewBox="0 0 72 72" focusable="false">
        <circle className="why-open-check-ring" cx="36" cy="36" r="30" />
        <path
          className="why-open-check-mark"
          d="M20 37.5c2.8 3.6 8.6 12.8 14.8 17.6 1.2 0.9 2.6 0.35 3.3-0.9C46.2 41.5 54.6 27.2 64 14"
          pathLength={1}
        />
      </svg>
    </span>
  )
}

function LimeMark({ word, index }: { word: string; index: number }) {
  return (
    <span
      className="biz-em draw-behind draw-underline hero-line"
      style={{ ['--hero-i' as string]: index } as CSSProperties}
    >
      <span className="draw-behind-text">{word}</span>
      <svg
        className="draw-behind-fill draw-underline-stroke"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M1 7 Q 40 3.5, 80 7.5 T 160 7 Q 180 9, 199 6.5" />
      </svg>
    </span>
  )
}

function highlightHero(line: string, lineIndex: number): ReactNode[] {
  const pattern = new RegExp(`(${heroHighlights.join('|')})`, 'g')
  return line.split(pattern).map((part, index) =>
    heroHighlights.includes(part) ? (
      <LimeMark word={part} index={lineIndex + 1} key={`${part}-${index}`} />
    ) : (
      part
    ),
  )
}

export function BusinessPage() {
  const whyNow = useInView<HTMLElement>({ threshold: 0.18 })
  const envelope = useInView<HTMLElement>({ threshold: 0.2 })
  const envelopePinRef = useRef<HTMLElement | null>(null)
  const [activeWhy, setActiveWhy] = useState<number | null>(0)

  function toggleWhy(index: number) {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (finePointer) return
    setActiveWhy((current) => (current === index ? null : index))
  }

  return (
    <PageShell>
      <section className="page-hero-shell biz-hero-shell">
        <LinesHero
          className="biz-hero-lines"
          contentClassName="biz-hero-mesh-content"
          label={c.hero.title}
          tone="mesh"
          cover
        >
          <div className="biz-hero-inner draw-sequence">
            <HeroUnderline as="h1" index={0} underline className="biz-hero-title">
              {c.hero.title}
            </HeroUnderline>
            {c.hero.lines.map((line, index) => (
              <p
                className="lead biz-hero-line hero-line"
                key={line.slice(0, 24)}
                style={{ ['--hero-i' as string]: index + 1 } as CSSProperties}
              >
                {highlightHero(line, index + 1)}
              </p>
            ))}
          </div>
        </LinesHero>
      </section>

      <section
        className={whyNow.visible ? 'blk alt biz-why-section is-in' : 'blk alt biz-why-section'}
        ref={whyNow.ref}
      >
        <div className="wrap">
          <h2 className="biz-why-heading find-rise">{c.whyNow.title}</h2>
          <div
            className="biz-why-strip find-rise"
            style={{ animationDelay: '0.14s' }}
            onMouseLeave={() => {
              if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                setActiveWhy(0)
              }
            }}
          >
            {c.whyNow.items.map((item, index) => (
              <article
                className={
                  activeWhy === index ? 'biz-why-pane is-active find-rise' : 'biz-why-pane find-rise'
                }
                key={item.title}
                tabIndex={0}
                style={{ animationDelay: `${0.18 + index * 0.12}s` }}
                onMouseEnter={() => setActiveWhy(index)}
                onFocus={() => setActiveWhy(index)}
                onClick={() => toggleWhy(index)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return
                  event.preventDefault()
                  setActiveWhy((current) => (current === index ? null : index))
                }}
              >
                <BizWhyCheck />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={
          envelope.visible
            ? 'envelope-scroll-pin biz-envelope why-block is-in'
            : 'envelope-scroll-pin biz-envelope why-block'
        }
        ref={(node) => {
          envelope.ref.current = node
          envelopePinRef.current = node
        }}
      >
        <div className="envelope-scroll-sticky">
          <LinesHero
            className="lines-hero-section"
            contentClassName="lines-hero-section-content"
            label="מעטפת השירות"
            interactive
            cover
            showLines
          >
            <div className="wrap">
              <div className="find-here-copy">
                <p className="lead biz-envelope-intro find-rise">
                  {c.envelope.intro.split('\n').map((line) =>
                    line.includes('מעטפת מלאה') ? (
                      <HeroUnderline
                        as="span"
                        key={line}
                        underline
                        inView
                        className="biz-envelope-line"
                      >
                        {line}
                      </HeroUnderline>
                    ) : (
                      <span className="biz-envelope-line" key={line}>
                        {line}
                      </span>
                    ),
                  )}
                </p>
              </div>
              <EnvelopeFanCards items={c.envelope.items} pinRef={envelopePinRef} />
            </div>
          </LinesHero>
        </div>
      </section>

      <section className="blk biz-how" id="how">
        <div className="wrap">
          <ProcessSteps title={c.process.title} intro={c.process.intro} steps={c.process.steps} />
        </div>
      </section>

      <section className="blk biz-works" id="works">
        <div className="wrap biz-works-wrap">
          <MediaGallery title={c.worksTitle} videos={c.works} previewCount={c.works.length} />
          <BlockedStamp
            className="blocked-stamp-biz"
            subject={businessBlockedMail.subject}
            body={businessBlockedMail.body}
          />
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
