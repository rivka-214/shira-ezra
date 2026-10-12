import { useEffect, useRef, useState } from 'react'
import { site } from '../../data/site'

type ShowreelPlayer = {
  mute: () => void
  playVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  getCurrentTime: () => number
  getDuration: () => number
  destroy: () => void
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string
          playerVars: Record<string, string | number>
          events: {
            onReady: (event: { target: ShowreelPlayer }) => void
            onStateChange: (event: { data: number; target: ShowreelPlayer }) => void
          }
        },
      ) => ShowreelPlayer
      PlayerState: { PLAYING: number; ENDED: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

function whenYouTubeReady() {
  if (window.YT?.Player) return Promise.resolve()
  return new Promise<void>((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve()
    }
    if (!document.querySelector('script[data-youtube-iframe-api]')) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      tag.dataset.youtubeIframeApi = '1'
      document.head.appendChild(tag)
    }
  })
}

export function HeroShowreel() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mount = mountRef.current
    if (reduce || !mount) return

    let player: ShowreelPlayer | null = null
    let cancelled = false
    let loopTimer = 0
    const revealTimer = window.setTimeout(() => {
      if (!cancelled) setPlaying(true)
    }, 1650)

    whenYouTubeReady().then(() => {
      if (cancelled || !mountRef.current || !window.YT) return
      const id = site.showreelYoutubeId
      player = new window.YT.Player(mountRef.current, {
        videoId: id,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          cc_load_policy: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            event.target.mute()
            event.target.playVideo()
            loopTimer = window.setInterval(() => {
              try {
                const duration = event.target.getDuration()
                const current = event.target.getCurrentTime()
                if (duration > 1 && duration - current < 0.4) event.target.seekTo(0, true)
              } catch {
                // הנגן עדיין לא מוכן
              }
            }, 200)
          },
          onStateChange: (event) => {
            const playingState = window.YT?.PlayerState.PLAYING ?? 1
            const endedState = window.YT?.PlayerState.ENDED ?? 0
            if (event.data === endedState) {
              event.target.seekTo(0, true)
              event.target.playVideo()
              return
            }
            if (event.data === playingState) event.target.playVideo()
          },
        },
      })
    })

    return () => {
      cancelled = true
      window.clearTimeout(revealTimer)
      window.clearInterval(loopTimer)
      player?.destroy()
    }
  }, [])

  return (
    <div className={playing ? 'hero-showreel is-ready' : 'hero-showreel'} aria-hidden="true">
      <div ref={mountRef} />
      <div className="hero-showreel-cover" />
    </div>
  )
}
