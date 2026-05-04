/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { type ReactNode } from 'react'
import { Div, Span } from 'startupjs-ui'

export const PERSON_OPTIONS = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Analytical Engine notes' },
  { value: 'grace', label: 'Grace Hopper', description: 'Compiler pioneer' },
  { value: 'hedy', label: 'Hedy Lamarr', description: 'Frequency hopping inventor' }
]

export const NUMBER_OPTIONS = [
  { value: 1, label: 'One' },
  { value: 2, label: 'Two' },
  { value: 3, label: 'Three' }
]

export function StoryStack ({ children }: { children?: ReactNode }) {
  return <Div gap={2}>{children}</Div>
}

export function InlineRow ({ children }: { children?: ReactNode }) {
  return (
    <Div row wrap gap={2} vAlign='center'>
      {children}
    </Div>
  )
}

export function StorySection ({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <Div gap={1.5}>
      <Div gap={0.5}>
        <Span h4>{title}</Span>
        {description ? <Span description>{description}</Span> : null}
      </Div>
      {children}
    </Div>
  )
}
