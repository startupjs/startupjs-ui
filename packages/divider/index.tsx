import { type ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, themed } from 'startupjs'
import { u } from '@startupjs-ui/core'
import STYLES from './index.cssx.styl'

const {
  config: { heights }
} = STYLES
const LINE_HEIGHT = u(2)

export default observer(themed('Divider', Divider))

export const _PropsJsonSchema = {/* DividerProps */}

export interface DividerProps {
  /** Custom styles applied to the divider */
  style?: StyleProp<ViewStyle>
  /** Divider orientation @default 'horizontal' */
  variant?: 'horizontal' | 'vertical'
  /** Divider thickness preset @default 'm' */
  size?: 'm' | 'l'
  /** Divider length in lines (1 line is 16px) @default 1 */
  lines?: number
  /** Test identifier */
  testID?: string
}

function Divider ({
  style,
  size = 'm',
  lines = 1,
  variant = 'horizontal',
  testID
}: DividerProps): ReactNode {
  const lineWidth = heights[size]
  const width = LINE_HEIGHT * lines
  const margin = (width - lineWidth) / 2
  const marginFirstSide = Math.floor(margin)
  const marginSecondSide = Math.ceil(margin)
  const extraStyle: Record<string, any> = {}

  switch (variant) {
    case 'horizontal':
      extraStyle.height = lineWidth
      extraStyle.marginTop = marginFirstSide
      extraStyle.marginBottom = marginSecondSide
      break
    case 'vertical':
      extraStyle.width = lineWidth
      extraStyle.marginLeft = marginFirstSide
      extraStyle.marginRight = marginSecondSide
      break
  }

  return pug`
    View.root(style=[extraStyle, style] styleName=[size, variant] testID=testID)
  `
}
