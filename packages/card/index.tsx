import { type ReactNode } from 'react'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div, { type DivProps } from '@startupjs-ui/div'
import './index.cssx.styl'

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
      style=style
      styleName=[variant]
      onPress=onPress
      level=variant === 'elevated' ? level : undefined
      ...props
    )
      = children
  `
}
