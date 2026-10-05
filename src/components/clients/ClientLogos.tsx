import { clients } from '../../data/clients'

function loop<T>(items: T[]): T[] {
  return [...items, ...items]
}

export function ClientLogos() {
  const logos = [...clients.logos]
  const rowA = loop(logos.filter((_, i) => i % 2 === 0))
  const rowB = loop(logos.filter((_, i) => i % 2 === 1))

  return (
    <div className="logo-wall" aria-label={clients.title}>
      <div className="logo-marquee">
        <div className="logo-track">
          {rowA.map((logo, i) => (
            <div className="logo-slot" key={`a-${logo.name}-${i}`}>
              <img src={logo.src} alt="" />
            </div>
          ))}
        </div>
      </div>
      <div className="logo-marquee">
        <div className="logo-track reverse">
          {rowB.map((logo, i) => (
            <div className="logo-slot" key={`b-${logo.name}-${i}`}>
              <img src={logo.src} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
