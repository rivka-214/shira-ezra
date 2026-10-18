import { Link } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { site } from '../data/site'

export function PrivacyPage() {
  return (
    <PageShell>
      <section className="blk privacy-page">
        <div className="wrap privacy-wrap">
          <p className="privacy-back">
            <Link to="/">← חזרה לאתר</Link>
          </p>
          <h1>מדיניות פרטיות</h1>
          <p className="privacy-lead">
            האתר של {site.name} מכבד את פרטיות המבקרים. מסמך זה מסביר אילו מידע נאסף ואיך משתמשים בו.
          </p>

          <h2>איזה מידע נאסף</h2>
          <ul>
            <li>
              פרטים שאתם משאירים בטופס יצירת קשר (שם, טלפון, מייל והודעה) — רק כשאתם שולחים אותם.
            </li>
            <li>
              פניות ישירות בטלפון או במייל ל־{site.email}.
            </li>
            <li>
              מידע טכני בסיסי שהדפדפן שולח אוטומטית (כמו סוג דפדפן) בעת גלישה באתר.
            </li>
          </ul>

          <h2>למה משתמשים במידע</h2>
          <ul>
            <li>כדי לחזור אליכם ולתאם שירותי צילום ועריכה.</li>
            <li>כדי לשפר את חוויית השימוש באתר.</li>
          </ul>

          <h2>עוגיות ושירותי צד ג׳</h2>
          <ul>
            <li>
              האתר עשוי להשתמש בעוגיות טכניות לזכירת העדפת באנר העוגיות.
            </li>
            <li>
              סרטוני YouTube מוטמעים באמצעות youtube-nocookie; גוגל עשויה לאסוף מידע לפי
              מדיניות הפרטיות שלה.
            </li>
          </ul>

          <h2>שיתוף מידע</h2>
          <p>
            הפרטים שלכם לא נמכרים לצדדים שלישיים. הם ישמשו רק לצורך יצירת קשר מקצועי מולכם,
            אלא אם החוק מחייב אחרת.
          </p>

          <h2>יצירת קשר</h2>
          <p>
            לשאלות בנושא פרטיות:{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {' · '}
            <a href={site.phoneHref}>{site.phoneDisplay}</a>
          </p>

          <p className="privacy-updated">עודכן לאחרונה: אוקטובר 2026</p>
        </div>
      </section>
    </PageShell>
  )
}
