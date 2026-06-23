import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'

export const _PropsJsonSchema = {/* TbodyProps */} // used in docs generation

export interface TbodyProps extends DivProps {
  /** Custom styles applied to the body container */
  style?: StyleProp<ViewStyle>
  /** Body content rendered inside */
  children?: ReactNode
}

function Tbody ({ style, children, ...props }: TbodyProps): ReactNode {
  return pug`
    Div(
      part='root'
      ...props
      style=style
    )= children
  `
}

export default observer(themed('Tbody', Tbody))
