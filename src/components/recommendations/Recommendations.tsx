type Rec = { name: string; text: string; image?: string }

type Props = {
  title: string
  items: Rec[]
  limit?: number
}

function OutlineQuote({ className, glyph }: { className: string; glyph: string }) {
  return (
    <svg className={className} viewBox="68 14 82 78" fill="none" aria-hidden="true">
      <text
        x="110"
        y="128"
        textAnchor="middle"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.25"
        strokeLinejoin="round"
        fontFamily="'Arial Black', Impact, sans-serif"
        fontSize="140"
      >
        {glyph}
      </text>
    </svg>
  )
}

export function Recommendations({ title, items, limit }: Props) {
  const shown = typeof limit === 'number' ? items.slice(0, limit) : items

  return (
    <div className="rec-block">
      <h2>{title}</h2>
      {shown.length === 0 ? (
        <div className="missing-block" role="status">
          המלצות לתחום זה יתווספו בהמשך.
        </div>
      ) : (
        <div className="rec-grid">
          {shown.map((item, index) => (
            <article className="rec-card" key={`${item.name}-${index}`}>
              <OutlineQuote className="rec-q rec-q-open" glyph="”" />
              <p>{item.text}</p>
              <OutlineQuote className="rec-q rec-q-close" glyph="“" />
              <div className="rec-by">
                {item.image ? <img src={item.image} alt="" /> : null}
                <strong>{item.name}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
