import { useEffect, useRef, useState } from 'react'
import { FadeUp } from '../motion/FadeUp'
import { RevealHeading } from '../motion/RevealHeading'
import { HorizontalScrollGallery } from './HorizontalScrollGallery'
import { useScrollProgress } from '../../motion/useScrollProgress'
import { useInView } from '../../motion/useInView'

export type GalleryVideo = {
  url: string
  title?: string
}

type Props = {
  title: string
  note?: string
  videos?: GalleryVideo[]
  moreLabel?: string
  previewCount?: number
  /** Horizontal scroll-driven row when enough items */
  scrollGallery?: boolean
}

function youtubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return match?.[1] ?? ''
}

function isFileVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url.split('#')[0] ?? '')
}

function isPlayableVideo(url: string) {
  return Boolean(youtubeId(url) || isFileVideoUrl(url))
}

function youtubeEmbedSrc(id: string, autoplay = false) {
  const params = new URLSearchParams()
  if (autoplay) params.set('autoplay', '1')
  params.set('origin', window.location.origin)
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`
}

function VideoTile({ url, title, index }: GalleryVideo & { index: number }) {
  const id = youtubeId(url)
  const isFile = isFileVideoUrl(url)
  const tileRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [seen, setSeen] = useState(false)
  const label = title || 'הפעלת סרטון לדוגמה'

  useEffect(() => {
    const tile = tileRef.current
    if (!tile) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSeen(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setSeen(true)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )
    observer.observe(tile)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={seen ? 'video-tile is-in' : 'video-tile'}
      ref={tileRef}
      style={{ ['--tile-delay' as string]: `${index * 0.08}s` }}
    >
      {isFile ? (
        playing ? (
          <video src={url} controls autoPlay playsInline title={label} />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={label}>
            <video src={url} preload="metadata" muted playsInline tabIndex={-1} aria-hidden />
            <span className="video-play" aria-hidden="true" />
          </button>
        )
      ) : playing ? (
        <iframe
          src={youtubeEmbedSrc(id, true)}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={label}>
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className="video-play" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function ProducedFeature({ video }: { video: GalleryVideo }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const progress = useScrollProgress(wrapRef)
  const scale = 0.88 + progress * 0.12
  const wide = progress > 0.55

  return (
    <div
      className={wide ? 'produced-scroll is-wide' : 'produced-scroll'}
      ref={wrapRef}
    >
      <div className="produced-feature" style={{ ['--produced-scale' as string]: scale }}>
        <VideoTile {...video} index={0} />
      </div>
    </div>
  )
}

export function MediaGallery({
  title,
  note,
  videos = [],
  moreLabel,
  previewCount = 3,
  scrollGallery = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const { ref: gridRef, visible: gridIn } = useInView<HTMLDivElement>({ threshold: 0.1 })
  const playable = videos.filter((video) => isPlayableVideo(video.url))
  const shown = open ? playable : playable.slice(0, previewCount)
  const hasMore = Boolean(moreLabel) && playable.length > previewCount
  const useHorizontal = scrollGallery && playable.length >= 2

  return (
    <div>
      {title ? <RevealHeading>{title}</RevealHeading> : null}
      {note ? (
        <FadeUp delay={0.08}>
          <p className="muted">{note}</p>
        </FadeUp>
      ) : null}
      {playable.length > 0 ? (
        playable.length === 1 && !open ? (
          <ProducedFeature video={playable[0]} />
        ) : useHorizontal ? (
          <HorizontalScrollGallery>
            {shown.map((video, index) => (
              <div className="h-scroll-item" key={video.url}>
                <VideoTile {...video} index={index} />
              </div>
            ))}
          </HorizontalScrollGallery>
        ) : (
          <div
            className={gridIn ? 'video-grid video-grid-motion is-in' : 'video-grid video-grid-motion'}
            ref={gridRef}
          >
            {shown.map((video, index) => (
              <VideoTile key={video.url} {...video} index={index} />
            ))}
          </div>
        )
      ) : (
        <FadeUp>
          <div className="missing-block" role="status">
            המדיה לתחום זה תתווסף בהמשך. לא מוצגות דוגמאות זמניות.
          </div>
        </FadeUp>
      )}
      {moreLabel && (!hasMore || !open) ? (
        <FadeUp delay={0.12}>
          <button
            type="button"
            className="btn btn-motion more-projects"
            onClick={() => setOpen(true)}
            aria-expanded={open}
          >
            <span className="btn-label">{moreLabel}</span>
          </button>
        </FadeUp>
      ) : null}
    </div>
  )
}
