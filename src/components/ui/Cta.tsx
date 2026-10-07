import type { ReactNode } from 'react'

type Props = {
  href?: string
  children: ReactNode
  onClick?: () => void
}

export function Cta({ href = '#contact', children, onClick }: Props) {
  return (
    <a className="btn btn-motion" href={href} onClick={onClick}>
      <span className="btn-label">{children}</span>
    </a>
  )
}
