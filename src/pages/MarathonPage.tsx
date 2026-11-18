import { useEffect, type ReactNode } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { MarathonForm } from '../components/marathon/MarathonForm'
import '../components/marathon/marathon.css'
import { Floaters, HeroArt } from '../components/brand/BrandDecor'
import { marathonContent as c } from '../data/marathon'
import { site } from '../data/site'

const FORM_HASH = '#marathon-form'

function CtaLink({ tone = 'lime', block = false }: { tone?: 'lime' | 'ink'; block?: boolean }) {
  const cls = ['mr-btn', tone === 'lime' ? 'mr-btn-lime' : 'mr-btn-ink', block ? 'mr-btn-block' : '']
    .filter(Boolean)
    .join(' ')
  return (
    <a className={cls} href={FORM_HASH}>
      {c.cta} ←
    </a>
  )
}

function Boom({ children, big = false, className = '' }: { children: ReactNode; big?: boolean; className?: string }) {
  return (
    <span className="mr-boomwrap">
      <span className={['mr-boom', big ? 'is-big' : '', className].filter(Boolean).join(' ')}>{children}</span>
    </span>
  )
}

function Check() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
      <path
        d="M3 10.5l4.5 4.5L17 5"
        fill="none"
        stroke="#6ee943"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function QuoteMark() {
  return (
    <svg aria-hidden="true" width="26" height="20" viewBox="0 0 26 20">
      <path d="M2 18 L8 2 M15 18 L21 2" fill="none" stroke="#6ee943" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  )
}

export function MarathonPage() {
  useEffect(() => {
    const prev = document.title
    document.title = c.meta.title
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <PageShell footer={false}>
      <div className="mr">
        {/* HERO */}
        <section className="mr-hero mr-tex">
          <HeroArt />
          <div className="mr-hero-inner">
            <div className="mr-pill mr-rise">
              {c.hero.pill} · <Boom>{c.launchPrice}</Boom>
            </div>
            <h1 className="mr-hero-title mr-rise mr-d1">
              {c.hero.title} <span className="mr-grad-text">{c.hero.titleAccent}</span>
            </h1>
            <p className="mr-hero-lead mr-rise mr-d2">{c.hero.lead}</p>
            <div className="mr-rise mr-d3">
              <CtaLink />
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="mr-sec mr-texl mr-center">
          <div className="mr-narrow">
            <h2 className="mr-h2 mr-uline">{c.problem.title}</h2>
            {c.problem.lines.map((line) => (
              <p className="mr-problem-line" key={line}>
                {line}
              </p>
            ))}
            <p className="mr-problem-punch mr-pop">{c.problem.punch}</p>
            <CtaLink tone="ink" />
          </div>
        </section>

        {/* INTRO */}
        <section className="mr-intro mr-center">
          <div className="mr-wide">
            <div className="mr-kicker mr-sr">{c.intro.kicker}</div>
            <h2 className="mr-intro-title mr-sr mr-s2">
              {c.intro.title} <strong className="mr-gfill">{c.intro.titleAccent}</strong>
            </h2>
            <p className="mr-intro-lead mr-sr mr-s3">{c.intro.lead}</p>
            <span className="mr-bar" />
          </div>
        </section>

        {/* HOW */}
        <section className="mr-sec mr-dark mr-tex" id="how">
          <div className="mr-wide">
            <h2 className="mr-h2 mr-uline mr-center">{c.how.title}</h2>
            <p className="mr-how-sub">{c.how.subtitle}</p>
            <div className="mr-steps">
              {c.how.steps.map((step, i) => (
                <div className="mr-step" key={step.title}>
                  <div className="mr-step-num">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="mr-step-title">{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
            <div className="mr-center mr-after-steps">
              <CtaLink />
            </div>
          </div>
        </section>

        {/* EXAMPLES + TESTIMONIALS */}
        <section className="mr-sec mr-texl" id="works">
          <div className="mr-xwide">
            <h2 className="mr-h2 mr-uline mr-center mr-examples-title">
              {c.examples.title} <strong className="mr-gfill">{c.examples.titleAccent}</strong>
            </h2>
            <div className="mr-cards">
              {c.examples.items.map((t) => (
                <article className="mr-card" key={t.name}>
                  <div className="mr-card-top">
                    <div className="mr-card-gif">
                      <img src={t.image} alt={t.imageAlt} loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <div className="mr-card-body">
                    {t.tag ? <div className="mr-card-tag">{t.tag}</div> : null}
                    {t.lines.length > 0 ? (
                      <>
                        <QuoteMark />
                        <blockquote>
                          {t.lead ? (
                            <>
                              <strong>{t.lead}</strong>
                              {t.lineBreaks ? <br /> : ' '}
                            </>
                          ) : null}
                          {t.lineBreaks
                            ? t.lines.map((line, i) => (
                                <span key={line}>
                                  {line}
                                  {i < t.lines.length - 1 ? <br /> : null}
                                </span>
                              ))
                            : t.lines.join(' ')}
                        </blockquote>
                      </>
                    ) : null}
                    <div className="mr-card-name">{t.name}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="mr-sec mr-pricing" id="packages">
          <div className="mr-mid">
            <h2 className="mr-pricing-title">
              {c.pricing.title}
              <br />
              <Boom big className="is-deep">
                {c.launchPrice}
              </Boom>
            </h2>
            <div className="mr-plans">
              {c.pricing.plans.map((plan) => (
                <div className={plan.dark ? 'mr-plan is-dark' : 'mr-plan'} key={plan.title}>
                  {plan.badge ? <span className="mr-plan-badge">{plan.badge}</span> : null}
                  <div className="mr-plan-option">{plan.option}</div>
                  <h3 className="mr-plan-title">{plan.title}</h3>
                  {plan.features.map((f) => (
                    <div className="mr-plan-li" key={f}>
                      <Check />
                      <span>{f}</span>
                    </div>
                  ))}
                  <div className="mr-plan-price">
                    {plan.price} <span>₪</span>
                  </div>
                  <div className="mr-plan-note">
                    <Boom className={plan.dark ? '' : 'is-deep'}>{c.pricing.priceNote}</Boom>
                  </div>
                  <CtaLink block />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="mr-sec mr-texl mr-center">
          <div className="mr-narrow">
            <h2 className="mr-h2 mr-uline">{c.about.title}</h2>
            {c.about.paragraphs.map((p) => (
              <p className="mr-about-p" key={p.strong}>
                {p.text}
                <br />
                <strong>{p.strong}</strong>
              </p>
            ))}
          </div>
        </section>

        {/* FORM */}
        <section className="mr-sec mr-dark mr-tex mr-form-sec" id="marathon-form">
          <div className="mr-narrow">
            <h2 className="mr-h2 mr-uline mr-center">{c.form.title}</h2>
            <p className="mr-form-lead">{c.form.lead}</p>
            <MarathonForm />
          </div>
        </section>

        <footer className="mr-footer">
          <span className="mr-footer-name">{site.name}</span>
          <span className="mr-footer-sep" aria-hidden="true">|</span>
          <span className="mr-footer-tagline">{c.footerTagline}</span>
          <span className="mr-footer-sep" aria-hidden="true">|</span>
          <a href={site.phoneHref} dir="ltr">
            {site.phoneDisplay}
          </a>
          <span className="mr-footer-sep" aria-hidden="true">|</span>
          <a href={`mailto:${site.email}`} dir="ltr" className="mr-footer-mail">
            {site.email}
          </a>
        </footer>

        <Floaters />
      </div>
    </PageShell>
  )
}
