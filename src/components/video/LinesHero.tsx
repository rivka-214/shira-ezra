import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '../../motion/useReducedMotion'

type Props = {
  children: ReactNode
  className?: string
  contentClassName?: string
  label?: string
  /** Allow clicks/hover on children while still warping lines under the pointer. */
  interactive?: boolean
}

const VIEW_W = 1600
const VIEW_H = 900

/** Mouse-local warp over the real artwork — lines drift aside under the cursor. */
export function LinesHero({
  children,
  className,
  contentClassName,
  label = 'עולם של וידאו',
  interactive = false,
}: Props) {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true })
    if (!ctx) return

    const source = document.createElement('canvas')
    const sctx = source.getContext('2d', { alpha: false, willReadFrequently: true })
    if (!sctx) return

    const img = new Image()
    img.decoding = 'async'
    img.src = '/images/video-lines-hero.png'

    const mouse = { x: -9999, y: -9999, inside: false }
    let ready = false
    let running = true
    let raf = 0
    let layout = { w: 1, h: 1, drawW: 1, drawH: 1, ox: 0, oy: 0 }

    const fit = () => {
      const rect = wrap.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width))
      const h = Math.max(1, Math.round(rect.height))
      canvas.width = w
      canvas.height = h

      const scale = Math.min(w / VIEW_W, h / VIEW_H)
      const drawW = Math.round(VIEW_W * scale)
      const drawH = Math.round(VIEW_H * scale)
      const ox = Math.round((w - drawW) / 2)
      const oy = Math.round((h - drawH) / 2)

      source.width = drawW
      source.height = drawH
      sctx.fillStyle = '#fff'
      sctx.fillRect(0, 0, drawW, drawH)
      if (ready) sctx.drawImage(img, 0, 0, drawW, drawH)

      layout = { w, h, drawW, drawH, ox, oy }
    }

    const paintStatic = () => {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, layout.w, layout.h)
      if (ready) ctx.drawImage(source, layout.ox, layout.oy)
    }

    const paintWarp = (now: number) => {
      paintStatic()
      if (reduce || !ready || !mouse.inside) return

      const { x, y } = mouse
      const { ox, oy, drawW, drawH } = layout
      if (x < ox || y < oy || x > ox + drawW || y > oy + drawH) return

      const radius = Math.max(80, drawW * 0.1)
      const strength = Math.max(16, drawW * 0.022)
      const t = now / 1000

      const x0 = Math.max(ox, Math.floor(x - radius))
      const y0 = Math.max(oy, Math.floor(y - radius))
      const x1 = Math.min(ox + drawW, Math.ceil(x + radius))
      const y1 = Math.min(oy + drawH, Math.ceil(y + radius))
      const rw = x1 - x0
      const rh = y1 - y0
      if (rw < 2 || rh < 2) return

      const sx0 = x0 - ox
      const sy0 = y0 - oy
      const base = sctx.getImageData(sx0, sy0, rw, rh)
      const out = ctx.createImageData(rw, rh)
      const bd = base.data
      const od = out.data
      const mx = x - ox
      const my = y - oy

      for (let py = 0; py < rh; py++) {
        for (let px = 0; px < rw; px++) {
          const ix = sx0 + px
          const iy = sy0 + py
          const dx = ix - mx
          const dy = iy - my
          const dist = Math.hypot(dx, dy)
          const i = (py * rw + px) * 4

          if (dist >= radius || dist < 0.001) {
            od[i] = bd[i]
            od[i + 1] = bd[i + 1]
            od[i + 2] = bd[i + 2]
            od[i + 3] = 255
            continue
          }

          const fall = 1 - dist / radius
          const soft = fall * fall * (3 - 2 * fall)
          const ang = Math.atan2(dy, dx)
          const wobble = Math.sin(t * 8 + dist * 0.05) * strength * soft
          const side = ang + Math.PI / 2
          const sampleX = ix - Math.cos(side) * wobble
          const sampleY = iy - Math.sin(side) * wobble

          const qx = Math.min(rw - 1, Math.max(0, Math.round(sampleX - sx0)))
          const qy = Math.min(rh - 1, Math.max(0, Math.round(sampleY - sy0)))
          const si = (qy * rw + qx) * 4
          od[i] = bd[si]
          od[i + 1] = bd[si + 1]
          od[i + 2] = bd[si + 2]
          od[i + 3] = 255
        }
      }

      ctx.putImageData(out, x0, y0)
    }

    const loop = (now: number) => {
      if (!running) return
      paintWarp(now)
      raf = requestAnimationFrame(loop)
    }

    const boot = () => {
      ready = true
      fit()
      paintStatic()
    }

    img.onload = boot
    if (img.complete && img.naturalWidth) boot()

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.inside = true
    }
    const onLeave = () => {
      mouse.inside = false
    }
    const onResize = () => {
      fit()
      paintStatic()
    }

    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
    ro?.observe(wrap)
    raf = requestAnimationFrame(loop)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
      ro?.disconnect()
    }
  }, [reduce])

  const rootClass = ['lines-hero', interactive ? 'is-interactive' : '', className]
    .filter(Boolean)
    .join(' ')
  const bodyClass = ['lines-hero-content', contentClassName].filter(Boolean).join(' ')

  return (
    <section className={rootClass} aria-label={label} ref={wrapRef}>
      <canvas className="lines-hero-canvas" ref={canvasRef} aria-hidden="true" />
      <div className={bodyClass}>{children}</div>
    </section>
  )
}
