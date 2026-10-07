/** Shared motion timing — keep animations consistent site-wide */
export const motionEase = 'cubic-bezier(0.22, 1, 0.36, 1)'
export const motionEaseOut = 'cubic-bezier(0.16, 1, 0.3, 1)'

export const motionDuration = {
  instant: 0.18,
  fast: 0.28,
  base: 0.55,
  slow: 0.78,
  marquee: 42,
} as const
