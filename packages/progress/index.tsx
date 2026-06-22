import { type ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, u, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import Filler from './filler'
import CircleFiller from './circleFiller'
import './index.cssx.styl'

export default observer(themed('Progress', Progress))

export const _PropsJsonSchema = {/* ProgressProps */}

export interface ProgressProps {
  /** Custom styles applied to the wrapper */
  style?: StyleProp<ViewStyle>
  /** Percent value between 0 and 100 @default 0 */
  value?: number
  /** Label content rendered under the progress bar */
  children?: ReactNode
  /** Progress visual variant @default 'linear' */
  variant?: 'linear' | 'circular'
  /** Shape of the progress track @default 'rounded' */
  shape?: DivProps['shape']
  /** Height of the progress bar @default u(0.5) */
  width?: number
  /** Style overrides for the progress track part */
  progressStyle?: DivProps['style']
  /** Style overrides for the filler part */
  fillerStyle?: StyleProp<ViewStyle>
  /** Test identifier */
  testID?: string
}

function Progress ({
  style,
  value = 0,
  children,
  variant = 'linear',
  shape = 'rounded',
  width = u(0.5),
  testID
}: ProgressProps): ReactNode {
  const isCircular = variant === 'circular'
  const extraStyle = isCircular ? {} : { height: width }

  return pug`
    View(style=style testID=testID)
      Div.progress(
        part='progress'
        style=extraStyle
        styleName=[variant]
        shape=shape
      )
        //- To normalize value pass value=Math.min(value, 100)
        if isCircular
          CircleFiller(part='filler' style=extraStyle value=value width=width)
        else
          Filler(part='filler' style=extraStyle value=value)
      if typeof children === 'string'
        Span.label= children
      else
        = children
  `
}
