import { type ReactNode } from 'react'
import { pug, observer, u, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'
import STYLES from './index.cssx.styl'

const {
  config: { defaultWidth }
} = STYLES

export default observer(themed('Content', Content))

export const _PropsJsonSchema = {/* ContentProps */}

export interface ContentProps extends Omit<DivProps, 'style' | 'padding' | 'full'> {
  /** Custom styles applied to the root view */
  style?: DivProps['style']
  /** Content rendered inside wrapper */
  children?: ReactNode
  /** Add equal top and bottom padding. true maps to default spacing @default false */
  padding?: boolean | number
  /** Expand to take full available space in parent flex layout @default false */
  full?: boolean
  /** Content width preset @default 'tablet' */
  width?: 'mobile' | 'tablet' | 'desktop' | 'wide' | 'full'
  /** Remove horizontal paddings */
  pure?: boolean
}

function Content ({
  children,
  padding = false,
  pure,
  width = defaultWidth,
  full = false,
  ...props
}: ContentProps): ReactNode {
  const _rootStyle: Record<string, any> = {}
  if (padding === true) padding = 2
  if (typeof padding === 'number') {
    _rootStyle.paddingTop = u(padding)
    _rootStyle.paddingBottom = u(padding)
  }

  return pug`
    Div.root(
      part='root'
      style=_rootStyle
      styleName=['width-' + width, { pure }]
      full=full
      ...props
    )= children
  `
}
