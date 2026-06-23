import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'

export const _PropsJsonSchema = {/* TheadProps */} // used in docs generation

export interface TheadProps extends DivProps {
  /** Custom styles applied to the header container */
  style?: StyleProp<ViewStyle>
  /** Header content rendered inside */
  children?: ReactNode
  /** Add bottom border to the header @default true */
  bordered?: boolean
}

function Thead ({
  style,
  children,
  bordered = true,
  ...props
}: TheadProps): ReactNode {
  return pug`
    Div(
      part='root'
      ...props
      style=[style]
      styleName=[{ bordered }]
    )= children
  `
}

export default observer(themed('Thead', Thead))

css`
  .bordered {
    border-color: var(--Table-border-color);
    border-bottom-width: var(--Table-border-width);
  }
`
