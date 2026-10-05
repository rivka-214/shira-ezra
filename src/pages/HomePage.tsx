import { DomainEntry } from '../components/home/DomainEntry'
import { HeroShowreel } from '../components/home/HeroShowreel'
import { PageShell } from '../components/layout/PageShell'
import { WaveDecor } from '../components/layout/WaveDecor'
import { site } from '../data/site'

export function HomePage() {
  return (
    <PageShell home>
      <section className="home-hero">
        <HeroShowreel />
        <div className="hero-veil" />
        <div className="home-center wrap">
          <img className="home-logo" src={site.logoSrc} alt={site.name} />
          <DomainEntry />
        </div>
        <WaveDecor variant="bottom" />
      </section>
    </PageShell>
  )
}
