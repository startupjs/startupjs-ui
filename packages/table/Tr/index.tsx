import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'

export const _PropsJsonSchema = {/* TrProps */} // used in docs generation

export interface TrProps extends DivProps {
  /** Custom styles applied to the row container */
  style?: StyleProp<ViewStyle>
  /** Row content rendered inside */
  children?: ReactNode
}

function Tr ({ style, children, ...props }: TrProps): ReactNode {
  return pug`
    Div(
      ...props
      style=style
      row
    )= children
  `
}

export default observer(themed('Tr', Tr))
