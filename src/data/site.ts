export const site = {
  name: 'שירה עזרא',
  phoneDisplay: '054.844.5344',
  phoneHref: 'tel:0548445344',
  email: 'Sh0548445344@gmail.com',
  contactTitle: 'יש לכם\nרעיון? בואו ניצור אותו יחד',
  contactLead: '\n\nאפשר\nלהשאיר פרטים כאן\n\n\nאו ליצור\nאיתי קשר ישירות:',
  contactPhoneLabel: 'טלפון',
  contactEmailLabel: 'מייל',
  logoSrc: '/brand/logo.png',
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
      { label: 'דוגמאות', hash: 'works' },
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
      { label: 'דוגמאות', hash: 'works' },
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
      { label: 'דוגמאות', hash: 'works' },
      { label: 'המלצות', hash: 'reviews' },
      { label: 'איך זה עובד', hash: 'how' },
      { label: 'בואו נתקדם', hash: 'contact' },
    ],
  },
]
