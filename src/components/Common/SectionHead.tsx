import type { ReactNode } from 'react'
import { Eyebrow } from './Eyebrow'

export function SectionHead({
  eyebrow,
  children,
  text,
}: {
  eyebrow: string
  children: ReactNode
  text?: string
}) {
  return (
    <div className="section-head">
      <Eyebrow className="rv">{eyebrow}</Eyebrow>
      <h2 className="rv d1">{children}</h2>
      {text ? <p className="rv d2">{text}</p> : null}
    </div>
  )
}
