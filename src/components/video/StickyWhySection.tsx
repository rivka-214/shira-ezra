import { FadeUp } from '../motion/FadeUp'
import { RevealHeading } from '../motion/RevealHeading'

type Item = { title: string; text: string }

type Props = {
  title: string
  items: Item[]
  active: boolean
}

export function StickyWhySection({ title, items, active }: Props) {
  return (
    <div className={`why-sticky${active ? ' is-in' : ''}`}>
      <div className="why-sticky-side">
        <RevealHeading className="why-sticky-title">{title}</RevealHeading>
      </div>
      <div className="why-sticky-panels">
        {items.map((item, index) => (
          <FadeUp className="why-sticky-panel" key={item.title} delay={0.08 + index * 0.1}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </FadeUp>
        ))}
      </div>
    </div>
  )
}
