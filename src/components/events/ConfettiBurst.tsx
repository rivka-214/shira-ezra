import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../motion/useReducedMotion'

type Props = {
  /** Wait before the burst starts. */
  delayMs?: number
  /** How long pieces stay on screen before fading out. */
  durationMs?: number
}

const GREENS = ['#84ed4d', '#6ee943', '#63d17a', '#4fd06a']
const BLUES = ['#301ab3', '#3e099e', '#6967dc', '#6762eb', '#5a4fd4']
const COLORS = [...GREENS, ...BLUES]

type Piece = {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  w: number
  h: number
  color: string
  wobble: number
  wobbleSpeed: number
  drag: number
  life: number
}

function makePieces(cx: number, cy: number, count: number): Piece[] {
  const pieces: Piece[] = []
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.55
    const speed = 7 + Math.random() * 18
    pieces.push({
      x: cx + (Math.random() - 0.5) * 24,
      y: cy + (Math.random() - 0.5) * 24,
      vx: Math.cos(angle) * speed * (0.65 + Math.random() * 0.7),
      vy: Math.sin(angle) * speed * (0.65 + Math.random() * 0.7) - 2.5,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.35,
      w: 10 + Math.random() * 22,
      h: 2.2 + Math.random() * 3.6,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.08 + Math.random() * 0.14,
      drag: 0.985 + Math.random() * 0.01,
      life: 1,
    })
  }
  return pieces
}

function drawRibbon(ctx: CanvasRenderingContext2D, p: Piece) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rot)
  ctx.globalAlpha = Math.max(0, p.life)
  ctx.strokeStyle = p.color
  ctx.lineWidth = p.h
  ctx.lineCap = 'round'
  ctx.beginPath()
  const amp = 3 + p.w * 0.08
  ctx.moveTo(-p.w * 0.5, 0)
  ctx.quadraticCurveTo(-p.w * 0.15, -amp + Math.sin(p.wobble) * 2, 0, Math.sin(p.wobble * 1.4) * amp)
  ctx.quadraticCurveTo(p.w * 0.2, amp - Math.sin(p.wobble) * 2, p.w * 0.5, 0)
  ctx.stroke()
  ctx.restore()
}

/** Center-burst confetti ribbons in brand green + blue. */
export function ConfettiBurst({ delayMs = 4000, durationMs = 6000 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [alive, setAlive] = useState(true)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setAlive(false)
      return
    }

    let cancelled = false
    let raf = 0
    let pieces: Piece[] = []
    let started = false
    let startAt = 0
    let fadeStart = 0

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    fit()
    window.addEventListener('resize', fit)

    const boot = () => {
      if (cancelled || started) return
      started = true
      startAt = performance.now()
      fadeStart = startAt + durationMs
      const cx = window.innerWidth * 0.5
      const cy = window.innerHeight * 0.42
      const count = window.innerWidth < 720 ? 140 : 220
      pieces = makePieces(cx, cy, count)
      raf = requestAnimationFrame(tick)
    }

    const tick = (now: number) => {
      if (cancelled) return
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const fadeT = now >= fadeStart ? clamp01((now - fadeStart) / 900) : 0
      const gravity = 0.18

      for (const p of pieces) {
        p.vx *= p.drag
        p.vy = p.vy * p.drag + gravity
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        p.wobble += p.wobbleSpeed
        p.life = 1 - fadeT
        drawRibbon(ctx, p)
      }

      if (fadeT >= 1) {
        setAlive(false)
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const delayTimer = window.setTimeout(boot, delayMs)
    const hardStop = window.setTimeout(() => setAlive(false), delayMs + durationMs + 1200)

    return () => {
      cancelled = true
      window.clearTimeout(delayTimer)
      window.clearTimeout(hardStop)
      window.removeEventListener('resize', fit)
      cancelAnimationFrame(raf)
    }
  }, [delayMs, durationMs])

  if (!alive) return null

  return (
    <canvas
      className="confetti-burst"
      ref={canvasRef}
      aria-hidden="true"
    />
  )
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}
