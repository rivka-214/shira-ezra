type Props = {
  href?: string
  label?: string
}

/** Repeated so the ring fills; chars flow RTL (counter-clockwise). */
const RING = 'שריינו תאריך עכשיו · שריינו תאריך עכשיו · '

export function SpinBookDate({
  href = '#contact',
  label = 'שריינו תאריך עכשיו',
}: Props) {
  const chars = Array.from(RING)
  const step = 360 / chars.length

  return (
    <a className="spin-book-date" href={href} aria-label={label}>
      <span className="spin-book-date-disk" aria-hidden="true">
        {chars.map((char, index) => (
          <span
            className="spin-book-date-char"
            key={`${char}-${index}`}
            style={{ ['--a' as string]: `${-step * index}deg` }}
          >
            <i>{char === ' ' ? '\u00A0' : char}</i>
          </span>
        ))}
      </span>
    </a>
  )
}
