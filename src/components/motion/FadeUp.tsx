import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../../motion/useInView'

type Props = {
  children: ReactNode
  className?: string
  as?: ElementType
  delay?: number
  style?: CSSProperties
}

export function FadeUp({ children, className = '', as: Tag = 'div', delay = 0, style }: Props) {
  const { ref, visible } = useInView({ threshold: 0.12 })
  return (
    <Tag
      ref={ref}
      className={`motion-fade-up${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...style, ['--motion-delay' as string]: `${delay}s` }}
    >
      {children}
    </Tag>
  )
}
