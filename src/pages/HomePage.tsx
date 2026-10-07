import { DomainEntry } from '../components/home/DomainEntry'
import { HomeHeroMotion } from '../components/home/HomeHeroMotion'
import { HeroShowreel } from '../components/home/HeroShowreel'
import { PageShell } from '../components/layout/PageShell'
import { WaveDecor } from '../components/layout/WaveDecor'
import { site } from '../data/site'

export function HomePage() {
  return (
    <PageShell home>
      <HomeHeroMotion>
        <HeroShowreel />
        <div className="hero-veil" />
        <div className="home-center wrap">
          <img
            className="home-logo home-rise"
            src={site.logoSrc}
            alt={site.name}
            style={{ animationDelay: '0.18s' }}
          />
          <DomainEntry />
        </div>
        <WaveDecor variant="bottom" />
      </HomeHeroMotion>
    </PageShell>
  )
}
