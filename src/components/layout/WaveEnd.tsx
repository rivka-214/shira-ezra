import { useId } from 'react'

type Fill = 'gradient' | 'purple' | 'ink' | 'blue'

type Props = {
  /** Brand gradient by default — matches the site lime→indigo bar. */
  fill?: Fill
  className?: string
}

/**
 * Flat top (joins the section edge), wavy bottom hangs below.
 */
const PATH =
  'M0 0 L1440 0 L1440 72 C1320 102, 1180 114, 1040 104 C880 92, 740 48, 580 36 C420 24, 260 58, 120 78 C60 86, 20 80, 0 66 Z'

const FILLS: Record<Fill, string | 'gradient'> = {
  gradient: 'gradient',
  purple: '#5433FE',
  ink: '#190b40',
  blue: '#301ab3',
}

export function WaveEnd({ fill = 'gradient', className = '' }: Props) {
  const gid = `we-${useId().replace(/:/g, '')}`
  const paint = FILLS[fill]
  const fillValue = paint === 'gradient' ? `url(#${gid})` : paint

  return (
    <div className={['wave-end', className].filter(Boolean).join(' ')} aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" focusable="false">
        {paint === 'gradient' ? (
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6ee943" />
              <stop offset="18%" stopColor="#63d17a" />
              <stop offset="55%" stopColor="#6762eb" />
              <stop offset="78%" stopColor="#301ab3" />
              <stop offset="100%" stopColor="#3e099e" />
            </linearGradient>
          </defs>
        ) : null}
        <path d={PATH} fill={fillValue} />
      </svg>
    </div>
  )
}
