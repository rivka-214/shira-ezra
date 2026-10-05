import { useId } from 'react'

type Props = { variant?: 'top' | 'bottom' | 'footer' | 'accent' }

const BELOW = [
  'M-40 112 C 220 128, 500 92, 780 76 C 1060 60, 1260 84, 1500 92',
  'M-40 128 C 200 142, 480 108, 760 92 C 1040 76, 1250 98, 1500 108',
]

const ABOVE = [
  'M-40 70 C 240 86, 520 58, 800 42 C 1080 26, 1280 44, 1500 50',
  'M-40 86 C 230 100, 510 72, 790 56 C 1070 40, 1270 60, 1500 68',
]

const RIBBON = 'M-40 98 C 220 114, 500 76, 780 60 C 1060 44, 1260 70, 1500 78'

export function WaveDecor({ variant = 'bottom' }: Props) {
  const id = `wg-${useId().replace(/:/g, '')}`

  return (
    <div className={`waves waves-${variant}`} aria-hidden="true">
      <svg viewBox="0 0 1440 160">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7af04a" />
            <stop offset="38%" stopColor="#5dce78" />
            <stop offset="58%" stopColor="#5b63e4" />
            <stop offset="82%" stopColor="#3418b8" />
            <stop offset="100%" stopColor="#2c0898" />
          </linearGradient>
        </defs>
        {BELOW.map((d) => (
          <path key={d} className="line thin" d={d} />
        ))}
        <path className="line ribbon" d={RIBBON} stroke={`url(#${id})`} strokeWidth={32} />
        {ABOVE.map((d) => (
          <path key={d} className="line thin" d={d} />
        ))}
      </svg>
    </div>
  )
}
