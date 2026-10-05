import { useEffect, useRef, useState } from 'react'

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
}

function youtubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return match?.[1] ?? ''
}

function VideoTile({ url, title }: GalleryVideo) {
  const id = youtubeId(url)
  const tileRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [seen, setSeen] = useState(false)
  const label = title || 'הפעלת סרטון לדוגמה'

  useEffect(() => {
    const tile = tileRef.current
    if (!tile) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setSeen(true)
        observer.disconnect()
      },
      { threshold: 0.45 },
    )
    observer.observe(tile)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={seen ? 'video-tile is-in' : 'video-tile'} ref={tileRef}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={label}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" />
          <span className="video-play" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export function MediaGallery({ title, note, videos = [], moreLabel, previewCount = 3 }: Props) {
  const [open, setOpen] = useState(false)
  const playable = videos.filter((video) => youtubeId(video.url))
  const shown = open ? playable : playable.slice(0, previewCount)
  const hasMore = Boolean(moreLabel) && playable.length > previewCount

  return (
    <div>
      {title ? <h2>{title}</h2> : null}
      {note ? <p className="muted">{note}</p> : null}
      {playable.length > 0 ? (
        <div className="video-grid">
          {shown.map((video) => (
            <VideoTile key={video.url} url={video.url} title={video.title} />
          ))}
        </div>
      ) : (
        <div className="missing-block" role="status">
          המדיה לתחום זה תתווסף בהמשך. לא מוצגות דוגמאות זמניות.
        </div>
      )}
      {moreLabel && (!hasMore || !open) ? (
        <button
          type="button"
          className="btn more-projects"
          onClick={() => setOpen(true)}
          aria-expanded={open}
        >
          {moreLabel}
        </button>
      ) : null}
    </div>
  )
}
