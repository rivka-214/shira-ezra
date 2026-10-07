export function CameraSketch() {
  return (
    <svg className="video-camera" viewBox="0 0 140 100" aria-hidden="true">
      <defs>
        <linearGradient id="video-camera-grad" x1="14" y1="24" x2="126" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6ee943" />
          <stop offset="42%" stopColor="#d8ffc8" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <path
        className="video-camera-path video-camera-body"
        d="M22 36H46L54 24H86L94 36H118a8 8 0 0 1 8 8V78a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8V44a8 8 0 0 1 8-8z"
      />
      <path
        className="video-camera-path video-camera-lens"
        d="M86 61a16 16 0 1 0-32 0a16 16 0 1 0 32 0"
      />
      <path
        className="video-camera-path video-camera-iris"
        d="M76 61a6 6 0 1 0-12 0a6 6 0 1 0 12 0"
      />
    </svg>
  )
}
