import { type ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import './index.cssx.styl'

interface ProgressFillerProps {
  style?: StyleProp<ViewStyle>
  value: number
}

function ProgressFiller ({ style, value }: ProgressFillerProps): ReactNode {
  return pug`
    View.filler(style=[{ width: value + '%' }, style])
  `
}

export default observer(themed('Progress', ProgressFiller))
