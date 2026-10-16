import type { CSSProperties, ElementType, ReactNode } from 'react'

type Props = {
  as?: ElementType
  className?: string
  /** Stagger index after the title (0 = first body line). */
  index?: number
  underline?: boolean
  /**
   * Wait for a parent `.is-in` / `.is-visible` cue instead of playing on page load.
   * Use for section intros that appear on scroll.
   */
  inView?: boolean
  style?: CSSProperties
  children: ReactNode
}

/** Hero line that rises in sequence; optional thin lime underline draws with it. */
export function HeroUnderline({
  as: Tag = 'p',
  className = '',
  index = 0,
  underline = false,
  inView = false,
  style,
  children,
}: Props) {
  const classes = [
    inView ? 'line-inview' : 'hero-line',
    underline ? 'draw-behind draw-underline' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      className={classes}
      style={{ ['--hero-i' as string]: index, ...style } as CSSProperties}
    >
      {underline ? (
        <>
          <span className="draw-behind-text">{children}</span>
          <svg
            className="draw-behind-fill draw-underline-stroke"
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M1 7 Q 40 3.5, 80 7.5 T 160 7 Q 180 9, 199 6.5" />
          </svg>
        </>
      ) : (
        children
      )}
    </Tag>
  )
}
