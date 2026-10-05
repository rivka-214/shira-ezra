type Pkg = {
  name: string
  price?: string
  description?: string
  features: string[]
}

type Props = {
  title: string
  items: Pkg[]
}

export function EventPackages({ title, items }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      <div className="pkg-grid">
        {items.map((pkg) => {
          const empty =
            !pkg.price && !pkg.description && pkg.features.length === 0
          return (
            <article className="pkg-card" key={pkg.name}>
              <h3>{pkg.name}</h3>
              {pkg.price ? <p className="pkg-price">{pkg.price}</p> : null}
              {pkg.description ? <p>{pkg.description}</p> : null}
              {pkg.features.length > 0 ? (
                <ul>
                  {pkg.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              ) : null}
              {empty ? (
                <p className="muted">חסר מידע — נדרש מהלקוחה</p>
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}
