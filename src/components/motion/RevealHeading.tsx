import type { ReactNode } from 'react'
import { useInView } from '../../motion/useInView'

type Props = {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}

export function RevealHeading({ children, className = '', as: Tag = 'h2' }: Props) {
  const { ref, visible } = useInView<HTMLHeadingElement>({ threshold: 0.2 })
  return (
    <Tag
      ref={ref}
      className={`motion-reveal-heading${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
    >
      <span className="motion-reveal-heading-inner">{children}</span>
    </Tag>
  )
}
