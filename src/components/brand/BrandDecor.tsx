/* Shared brand decor from the marathon page: hero ribbon artwork and drifting shapes. */
import '../marathon/marathon.css'
import './brand.css'

/** Decorative shapes that drift around the page (fixed, behind content clicks). */
export function Floaters() {
  return (
    <div className="mr-floaters" aria-hidden="true">
      <div className="mr-fl mr-p1" style={{ top: '78vh', right: '2vw' }}>
        <div className="mr-drift" style={{ animationDuration: '9s' }}>
          <svg width="86" height="86" viewBox="0 0 86 86">
            <circle className="mr-spin" cx="43" cy="43" r="36" fill="none" stroke="#6ee943" strokeWidth="3" strokeDasharray="10 12" />
            <circle cx="43" cy="43" r="9" fill="#6531e9" />
          </svg>
        </div>
      </div>
      <div className="mr-fl mr-p2" style={{ top: '-6vh', left: '1.5vw' }}>
        <div className="mr-drift is-reverse" style={{ animationDuration: '12s' }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <path className="mr-spin" d="M60 6 L74 46 L114 60 L74 74 L60 114 L46 74 L6 60 L46 46 Z" fill="none" stroke="#6531e9" strokeWidth="3" />
            <circle cx="60" cy="60" r="6" fill="#6ee943" />
          </svg>
        </div>
      </div>
      <div className="mr-fl mr-p1" style={{ top: '96vh', left: '3vw' }}>
        <div className="mr-drift" style={{ animationDuration: '10s' }}>
          <svg width="150" height="60" viewBox="0 0 150 60">
            <path className="mr-trace" d="M2 40 C 30 4, 60 56, 90 28 S 130 8, 148 30" fill="none" stroke="#6ee943" strokeWidth="5" strokeLinecap="round" />
            <path d="M2 40 C 30 4, 60 56, 90 28 S 130 8, 148 30" fill="none" stroke="#6762eb" strokeWidth="1.5" opacity=".55" />
          </svg>
        </div>
      </div>
      <div className="mr-fl mr-p2" style={{ top: '20vh', right: '1vw' }}>
        <div className="mr-drift is-reverse" style={{ animationDuration: '8s' }}>
          <svg width="46" height="46" viewBox="0 0 46 46">
            <rect className="mr-spin" x="8" y="8" width="30" height="30" rx="9" fill="#6ee943" opacity=".85" />
          </svg>
        </div>
      </div>
      <div className="mr-fl mr-p1" style={{ top: '55vh', left: '.8vw' }}>
        <div className="mr-drift" style={{ animationDuration: '11s' }}>
          <svg width="34" height="34" viewBox="0 0 34 34">
            <circle cx="17" cy="17" r="12" fill="#6762eb" opacity=".8" />
          </svg>
        </div>
      </div>
      <div className="mr-fl mr-p2" style={{ top: '8vh', right: '14vw' }}>
        <div className="mr-drift" style={{ animationDuration: '13s' }}>
          <svg width="28" height="28" viewBox="0 0 28 28">
            <path className="mr-spin" d="M14 2v24M2 14h24" stroke="#6ee943" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function HeroArt() {
  return (
    <svg className="mr-hero-art" aria-hidden="true" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mr-lg" x1="0" x2="1">
          <stop offset="0" stopColor="#6ee943" />
          <stop offset=".5" stopColor="#6531e9" />
          <stop offset="1" stopColor="#6ee943" />
        </linearGradient>
        <radialGradient id="mr-gl1" cx="0" cy="1" r=".7">
          <stop offset="0" stopColor="#6ee943" stopOpacity=".45" />
          <stop offset="1" stopColor="#6ee943" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mr-gl2" cx="1" cy="0" r=".7">
          <stop offset="0" stopColor="#301ab3" stopOpacity=".8" />
          <stop offset="1" stopColor="#301ab3" stopOpacity="0" />
        </radialGradient>
        <filter id="mr-grain">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0" />
        </filter>
      </defs>
      <rect width="1400" height="700" fill="url(#mr-gl1)" />
      <rect width="1400" height="700" fill="url(#mr-gl2)" />
      <g transform="translate(0,150)">
        <g className="mr-ribbon">
          <path d="M-80 560 C 260 640, 560 640, 820 500 S 1220 330, 1480 360" fill="none" stroke="url(#mr-lg)" strokeWidth="34" strokeLinecap="round" />
        </g>
        <path className="mr-flow" stroke="#fff" strokeWidth="2.5" d="M-50 470 C 250 400, 520 520, 820 420 S 1200 260, 1450 300" />
        <path className="mr-flow is-b" stroke="#fff" strokeWidth="2.5" d="M-50 520 C 250 450, 520 580, 820 470 S 1200 310, 1450 350" />
        <path className="mr-flow is-c" stroke="#fff" strokeWidth="2.5" d="M-50 420 C 250 350, 520 470, 820 370 S 1200 210, 1450 250" />
      </g>
      <rect width="1400" height="700" filter="url(#mr-grain)" opacity=".12" />
    </svg>
  )
}
