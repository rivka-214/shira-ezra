import { site } from '../../data/site'

export function HeroShowreel() {
  const id = site.showreelYoutubeId
  const src =
    `https://www.youtube.com/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}` +
    `&controls=0&rel=0&modestbranding=1&playsinline=1` +
    `&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0`

  return (
    <div className="hero-showreel" aria-hidden="true">
      <iframe
        src={src}
        title="שאווירל"
        allow="autoplay; encrypted-media"
        allowFullScreen={false}
        tabIndex={-1}
      />
    </div>
  )
}
