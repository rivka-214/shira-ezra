type Rec = { name: string; text: string; image?: string }

type Props = {
  title: string
  items: Rec[]
}

export function Recommendations({ title, items }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      {items.length === 0 ? (
        <div className="missing-block" role="status">
          המלצות לתחום זה יתווספו בהמשך.
        </div>
      ) : (
        <div className="rec-grid">
          {items.map((r) => (
            <article className="rec-card" key={r.name + r.text.slice(0, 12)}>
              {r.image ? <img src={r.image} alt="" /> : null}
              <p>{r.text}</p>
              <strong>{r.name}</strong>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
