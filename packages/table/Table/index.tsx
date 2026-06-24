import { type ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

export const _PropsJsonSchema = {/* TableProps */} // used in docs generation

export interface TableProps {
  /** Custom styles applied to the table container */
  style?: StyleProp<ViewStyle>
  /** Table content rendered inside */
  children?: ReactNode
  /** Test identifier */
  testID?: string
}

function Table ({ style, children, testID }: TableProps): ReactNode {
  return pug`
    View.root(part='root' style=style testID=testID)= children
  `
}

export default themed('Table', observer(Table))

css`
  .root {
    width: 100%;
  }
`
