import { type ReactNode } from 'react'
import { Text, type StyleProp, type TextStyle } from 'react-native'
import { pug, observer, themed } from 'startupjs'
import { u } from '@startupjs-ui/core'
import './index.cssx.styl'

const LINE_HEIGHT = u(2)

export const _PropsJsonSchema = {/* BrProps */}

export interface BrProps {
  /** Custom styles applied to the spacer */
  style?: StyleProp<TextStyle>
  /** Use half-height spacing */
  half?: boolean
  /** Number of spacer lines @default 1 */
  lines?: number
  /** Test identifier */
  testID?: string
}

function Br ({
  style,
  half = false,
  lines = 1,
  testID
}: BrProps): ReactNode {
  const height = half ? LINE_HEIGHT / 2 : LINE_HEIGHT * lines
  return pug`
    Text.root(style=[{ height }, style] testID=testID)
  `
}

export default observer(themed('Br', Br))
