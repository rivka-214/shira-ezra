import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../motion/useReducedMotion'

type Spark = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  decay: number
  size: number
  color: string
  kind: 'dot' | 'star'
}

const COLORS = ['#ffffff', '#f5fff2', '#6ee943', '#9af56a', '#c8ffb8', '#e8ffe0']

/** Soft white + lime spark trail that follows the pointer. */
export function SparkTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const sparks: Spark[] = []
    let raf = 0
    let running = true
    let lastX = -9999
    let lastY = -9999
    let lastT = 0
    let w = 1
    let h = 1

    const resize = () => {
      const rect = host.getBoundingClientRect()
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = (x: number, y: number, speed: number) => {
      const count = speed > 18 ? 3 : speed > 8 ? 2 : 1
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2
        const burst = 0.35 + Math.random() * 1.4
        sparks.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(ang) * burst,
          vy: Math.sin(ang) * burst - 0.25,
          life: 1,
          decay: 0.018 + Math.random() * 0.028,
          size: 0.9 + Math.random() * 2.2,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          kind: Math.random() > 0.72 ? 'star' : 'dot',
        })
      }
      // Cap so it stays delicate
      if (sparks.length > 90) sparks.splice(0, sparks.length - 90)
    }

    const drawStar = (x: number, y: number, size: number) => {
      ctx.beginPath()
      ctx.moveTo(x - size, y)
      ctx.lineTo(x + size, y)
      ctx.moveTo(x, y - size)
      ctx.lineTo(x, y + size)
      ctx.moveTo(x - size * 0.65, y - size * 0.65)
      ctx.lineTo(x + size * 0.65, y + size * 0.65)
      ctx.moveTo(x - size * 0.65, y + size * 0.65)
      ctx.lineTo(x + size * 0.65, y - size * 0.65)
      ctx.stroke()
    }

    const frame = () => {
      if (!running) return
      ctx.clearRect(0, 0, w, h)

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vx *= 0.94
        s.vy = s.vy * 0.94 + 0.012
        s.life -= s.decay
        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }

        ctx.globalAlpha = s.life * 0.85
        ctx.fillStyle = s.color
        ctx.strokeStyle = s.color
        ctx.shadowColor = s.color
        ctx.shadowBlur = s.kind === 'star' ? 8 : 5
        ctx.lineWidth = 1

        if (s.kind === 'star') {
          drawStar(s.x, s.y, s.size * 1.35)
        } else {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      raf = requestAnimationFrame(frame)
    }

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const now = performance.now()
      const dt = Math.max(now - lastT, 1)
      const dist = Math.hypot(x - lastX, y - lastY)
      const speed = dist / (dt / 16)
      if (dist > 2) spawn(x, y, speed)
      lastX = x
      lastY = y
      lastT = now
    }

    resize()
    host.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', resize)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    ro?.observe(host)
    raf = requestAnimationFrame(frame)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      host.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
      ro?.disconnect()
    }
  }, [])

  return <canvas className="spark-trail" ref={canvasRef} aria-hidden="true" />
}
