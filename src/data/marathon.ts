export type MarathonTestimonial = {
  /** Shown under the card, e.g. "נועה יצחקי | אפילציה". */
  name: string
  /** Animated signature GIF. */
  image: string
  imageAlt: string
  /** Small lime pill above the quote. */
  tag?: string
  /** Bold opening line of the quote. */
  lead?: string
  /** Quote lines; each one renders on its own line when `lineBreaks` is set. */
  lines: readonly string[]
  lineBreaks?: boolean
}

export type MarathonPlan = {
  option: string
  title: string
  badge?: string
  features: readonly string[]
  price: number
  /** Label used in the form's plan picker. */
  formLabel: string
  dark?: boolean
}

const cta = 'חייבת חתימת מייל מונפשת לעסק שלי'

export const marathonContent = {
  meta: {
    title: 'חתימת מייל מונפשת | שירה עזרא',
    description: 'הנפשת חתימת מייל ועיצוב חתימה מונפשת לעסקים, במחיר השקה.',
  },
  cta,
  launchPrice: 'במחיר השקה',
  footerTagline: 'וידאו. תדמית. עסקים',
  hero: {
    pill: 'מרתון הנפשות חתימות מייל',
    title: 'חתימת מייל מונפשת',
    titleAccent: 'שמדברת בשבילך',
    lead: 'הלוגו שלך הופך לחתימה חיה שמייצגת אותך מקצועית, בכל מייל שיוצא מהעסק.',
  },
  problem: {
    title: 'יש לך לוגו יפה, אבל החתימה במייל לא עושה לו כבוד',
    lines: [
      'אנחנו מוציאים כסף על מיתוג, על לוגו, על נוכחות.',
      'ובסוף, במייל שהוא הפנים של העסק, החתימה נראית פשוטה.',
    ],
    punch: 'יש לך הזדמנות לשדרג אותה, ולהראות נוכחות יציבה ומדברת.',
  },
  intro: {
    kicker: 'החתימה שלך יכולה יותר',
    title: 'חתימת מייל מונפשת',
    titleAccent: 'שמדברת בשבילך',
    lead: 'הלוגו שלך הופך לחתימה חיה שמייצגת אותך מקצועית',
  },
  how: {
    title: 'איך זה עובד?',
    subtitle: 'יום אחד ויש לך נראות מרשימה לעסק',
    steps: [
      { title: 'שולחת', text: 'את שולחת את החתימה הקיימת שלך.' },
      { title: 'אני מנפישה', text: 'הלוגו והחתימה מקבלים תנועה מקצועית ובטוב טעם.' },
      { title: 'חוזרת אלייך', text: 'החתימה חוזרת אלייך מונפשת, מוכנה לשליחה.' },
    ],
  },
  examples: {
    title: 'חתימות',
    titleAccent: 'שהונפשו',
    items: [
      {
        name: 'נועה יצחקי | אפילציה',
        image: '/marathon/signature-noa-yitzhaki.gif',
        imageAlt: 'חתימה מונפשת של נועה יצחקי',
        tag: 'עיצוב והנפשה',
        lead: 'שירה יקרה ❤️',
        lines: [
          'תודה ענקית על הכל',
          'יצא מושלםםםם',
          'אין על היצירתיות שלך בעולם',
          'ועל השירות? כל מילה מיותרת ☺️',
          'ממליצה בחום ❤️‍🔥',
        ],
        lineBreaks: true,
      },
      {
        name: 'רבקי שנברגר | אוריגימי',
        image: '/marathon/signature-origami.gif',
        imageAlt: 'חתימה מונפשת של אוריגימי',
        lines: [
          'נדיר!!!! איזה שווה!! תודה שירה, עשית לי את ההנפשה כל כך תואם לשפה העיצובית של המותג שלי, חלמתי על זה... הגשמת לי את זה יותר טוב ממה שחשבתי!',
        ],
      },
      {
        name: 'מירי פרנקו | מיינדסט',
        image: '/marathon/signature-mindset.gif',
        imageAlt: 'חתימה מונפשת של מיינדסט',
        lead: 'שירה האלופה,',
        lines: [
          'ההנפשה יפהפיה ומדויקת למסר. הצלחת לכוון לאסטרטגיה גם בלי לקרוא אותה :) את זמינה וממש כיף לתקשר איתך. תודה ענקית!!',
        ],
      },
      {
        name: 'חוי וינברג',
        image: '/marathon/signature-chavi-weinberg.gif',
        imageAlt: 'חתימה מונפשת של חוי וינברג',
        lines: [
          'ממליצה בחום על שירה עזרא האלופה. שירה הפכה את הלוגו שלי ליצירת אומנות מונפשת במקצועיות ובקו נקי ואלגנטי. היא נותנת את הנשמה לכל פרויקט ומוציאה יצירות עוצרות נשימה!',
        ],
      },
      {
        name: 'ישראל בקרמן | בקרמן בריאות',
        image: '/marathon/signature-bekerman-health.gif',
        imageAlt: 'חתימה מונפשת של בקרמן בריאות',
        lines: ['ואוו איזה יופי, מהמם תודה רבה.'],
      },
      {
        name: 'דסי לוי | צלמת',
        image: '/marathon/signature-dasi-levi.gif',
        imageAlt: 'חתימה מונפשת של דסי לוי',
        lead: 'שירה דייקת בדיוק למה שרציתי',
        lines: ['עיצוב נקי ועדין אהבתי מאוד', 'אלופה כמו תמיד'],
        lineBreaks: true,
      },
    ] as readonly MarathonTestimonial[],
  },
  pricing: {
    title: 'שתי אופציות,',
    priceNote: 'מחיר השקה מטורף',
    plans: [
      {
        option: 'אופציה 1',
        title: 'הנפשת חתימה או לוגו',
        features: ['את שולחת את החתימה הקיימת שלך', 'והחתימה חוזרת אלייך מונפשת מקצועית ובטוב טעם'],
        price: 280,
        formLabel: 'הנפשת חתימה או לוגו · 280 ₪',
      },
      {
        option: 'אופציה 2',
        title: 'עיצוב חתימה + הנפשה',
        badge: 'עיצוב מלא',
        features: [
          'את שולחת את הלוגו היפה שלך',
          'נחליט על עיצוב מותאם לפי הלוגו והשפה של המותג שלך',
          'והחתימה חוזרת אלייך מעוצבת ומונפשת מקצועית ובטוב טעם',
        ],
        price: 520,
        formLabel: 'עיצוב חתימה + הנפשה · 520 ₪',
        dark: true,
      },
    ] as readonly MarathonPlan[],
  },
  about: {
    title: 'קצת עליי',
    paragraphs: [
      {
        text: 'אני שירה עזרא, צלמת ועורכת וידאו לבעלות עסקים. יוצרת סרטוני תדמית, תוכן שיווקי וקורסים דיגיטליים, עם חשיבה יצירתית, הבנה שיווקית וראש גדול.',
        strong: 'עכשיו אני מביאה את התנועה גם לחתימת המייל שלך.',
      },
      {
        text: 'ראיתי מאות חתימות מייל, ורובן יפייפיות ומעוצבות.',
        strong: 'החלטתי לתת לך את האפשרות להעלות את החתימה לרמה שמכבדת אותך ואת ההשקעה במיתוג.',
      },
    ],
  },
  form: {
    title: 'בואי נתחיל.',
    lead: 'השאירי פרטים וצרפי את הלוגו או החתימה',
    planLabel: 'המסלול שלך',
    planDefault: 'נחליט יחד',
    fileButton: 'צירוף הלוגו או החתימה',
    fileHint: 'לא חובה · PNG, JPG, GIF, WebP · עד 3MB',
    sending: 'שולחת…',
    success: 'קיבלתי את הפרטים! כבר חוזרת אליך ונתקדם...',
    missingFields: 'נא למלא שם, מייל וטלפון.',
    fileTooBig: 'הקובץ גדול מדי. אפשר לצרף תמונה עד 3MB.',
    sendError: 'לא הצלחנו לשלוח. נסי שוב או צרי קשר בטלפון / מייל בתחתית העמוד.',
  },
} as const
