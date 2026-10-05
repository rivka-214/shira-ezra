type Props = { variant?: 'top' | 'bottom' | 'footer' | 'accent' }

export function WaveDecor({ variant = 'bottom' }: Props) {
  const id = `wg-${variant}`
  const showBand = variant !== 'top'
  return (
    <div className={`waves waves-${variant}`} aria-hidden="true">
      <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ee943" />
            <stop offset="35%" stopColor="#63d17a" />
            <stop offset="62%" stopColor="#6762eb" />
            <stop offset="100%" stopColor="#301ab3" />
          </linearGradient>
        </defs>
        <path
          className="line thin"
          d="M-20 40 C 180 10, 320 70, 520 40 S 860 10, 1100 50 S 1380 20, 1460 40"
          fill="none"
        />
        <path
          className="line thin"
          d="M-20 70 C 200 40, 360 100, 560 70 S 900 40, 1140 80 S 1400 50, 1460 70"
          fill="none"
        />
        <path
          className="line thin"
          d="M-20 100 C 220 80, 400 130, 620 95 S 980 70, 1220 110 S 1420 90, 1460 100"
          fill="none"
        />
        {showBand ? (
          <path
            fill={`url(#${id})`}
            d="M-40 150 C 220 90, 480 190, 760 130 S 1180 80, 1480 150 L 1480 230 L -40 230 Z"
            opacity="0.9"
          />
        ) : null}
      </svg>
    </div>
  )
}
