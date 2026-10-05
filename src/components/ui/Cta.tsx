import type { ReactNode } from 'react'

type Props = {
  href?: string
  children: ReactNode
  onClick?: () => void
}

export function Cta({ href = '#contact', children, onClick }: Props) {
  return (
    <a className="btn" href={href} onClick={onClick}>
      {children}
    </a>
  )
}
