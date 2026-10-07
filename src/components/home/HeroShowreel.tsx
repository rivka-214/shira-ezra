import { useEffect, useState } from 'react'
import { site } from '../../data/site'

export function HeroShowreel() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 120)
    return () => window.clearTimeout(t)
  }, [])
  const id = site.showreelYoutubeId
  const embedParams = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: id,
    controls: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    iv_load_policy: '3',
    disablekb: '1',
    fs: '0',
    cc_load_policy: '0',
    origin: window.location.origin,
  })
  const src = `https://www.youtube.com/embed/${id}?${embedParams}`

  return (
    <div className={ready ? 'hero-showreel is-ready' : 'hero-showreel'} aria-hidden="true">
      <iframe
        src={src}
        title="שאווירל"
        allow="autoplay; encrypted-media"
        allowFullScreen={false}
        tabIndex={-1}
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}
