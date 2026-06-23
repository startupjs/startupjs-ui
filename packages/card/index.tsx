import { type ReactNode } from 'react'
import { css, pug, observer, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'

export default observer(themed('Card', Card))

export const _PropsJsonSchema = {/* CardProps */}

export interface CardProps extends Omit<DivProps, 'variant' | 'level' | 'children' | 'style'> {
  /** Custom styles applied to the root view */
  style?: DivProps['style']
  /** Content rendered inside Card */
  children?: ReactNode
  /** Shadow intensity level @default 1 */
  level?: 0 | 1 | 2 | 3 | 4 | 5
  /** Visual appearance variant @default 'elevated' */
  variant?: 'elevated' | 'outlined'
}

function Card ({
  style,
  level = 1,
  children,
  variant = 'elevated',
  onPress,
  ...props
}: CardProps): ReactNode {
  return pug`
    Div.root(
      part='root'
      style=style
      styleName=[variant]
      onPress=onPress
      level=variant === 'elevated' ? level : undefined
      ...props
    )
      = children
  `
}

css`
  .root {
    padding: var(--Card-padding);
    border-radius: var(--Card-radius);
  }

  .root.elevated {
    background-color: var(--Card-bg);
  }

  .root.outlined {
    border-width: var(--Card-border-width);
    border-color: var(--Card-border-color);
    background-color: var(--Card-outlined-bg);
  }
`
