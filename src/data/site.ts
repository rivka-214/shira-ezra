export const site = {
  name: 'שירה עזרא',
  phoneDisplay: '054.844.5344',
  phoneHref: 'tel:0548445344',
  email: 'Sh0548445344@gmail.com',
  contactTitle: 'יש לכם רעיון, בואו ניצור אותו יחד',
  contactLead: 'אפשר להשאיר פרטים כאן\nאו ליצור איתי קשר ישירות',
  contactPhoneLabel: 'טלפון',
  contactEmailLabel: 'מייל',
  logoSrc: '/brand/logo.png',
  logoAnimatedSrc: '/brand/logo-animated.gif?v=3',
  showreelYoutubeId: 'sv9sXoJ1pp8',
} as const

export const routes = {
  home: '/',
  video: '/video',
  business: '/business',
  events: '/events',
} as const

export type DomainKey = 'video' | 'business' | 'events'

export const domainEntries: {
  key: DomainKey
  label: string
  path: string
  jumps: { label: string; hash: string }[]
}[] = [
  {
    key: 'video',
    label: 'וידאו',
    path: routes.video,
    jumps: [
      { label: 'למה איתי', hash: 'why' },
      { label: 'המלצות', hash: 'reviews' },
      { label: 'בואו נתקדם', hash: 'contact' },
    ],
  },
  {
    key: 'business',
    label: 'תדמית ועסקים',
    path: routes.business,
    jumps: [
      { label: 'המלצות', hash: 'reviews' },
      { label: 'איך זה עובד', hash: 'how' },
      { label: 'בואו נתקדם', hash: 'contact' },
    ],
  },
  {
    key: 'events',
    label: 'אירועים',
    path: routes.events,
    jumps: [
      { label: 'המלצות', hash: 'reviews' },
      { label: 'איך זה עובד', hash: 'how' },
      { label: 'בואו נתקדם', hash: 'contact' },
    ],
  },
]
