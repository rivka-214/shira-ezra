import { useInView } from '../../motion/useInView'
import { RevealHeading } from '../motion/RevealHeading'

type Pkg = {
  name: string
  price?: string
  description?: string
  features: string[]
}

type Props = {
  title: string
  items: Pkg[]
  centered?: boolean
}

export function EventPackages({ title, items, centered = false }: Props) {
  const { ref, visible } = useInView<HTMLDivElement>({ threshold: 0.15 })

  return (
    <div className={centered ? 'pkg-block pkg-block-center' : 'pkg-block'} ref={ref}>
      <RevealHeading>{title}</RevealHeading>
      <div className={visible ? 'pkg-stack is-in' : 'pkg-stack'}>
        {items.map((pkg, index) => {
          const empty =
            !pkg.price && !pkg.description && pkg.features.length === 0
          return (
            <article
              className="pkg-card"
              key={pkg.name}
              style={{ ['--pkg-i' as string]: index }}
            >
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
