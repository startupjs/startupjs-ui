import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import Star from './Star'
import './index.cssx.styl'

const AMOUNT = 5
const ITEMS = Array(AMOUNT).fill(null)

export default observer(themed('Rating', Rating))

export const _PropsJsonSchema = {/* RatingProps */}

export interface RatingProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Rating value displayed with stars @default 0 */
  value?: number
  /** Disable interactions and show compact view */
  readonly?: boolean
  /** Handler called when user selects a value */
  onChange?: (value: number) => void
}

function Rating ({
  style,
  value = 0,
  readonly = false,
  onChange
}: RatingProps): ReactNode {
  return pug`
    Div(style=style vAlign='center' row)
      if readonly
        Star(active)
        Span.value(bold h6)= value.toFixed(1)
      else
        each item, index in ITEMS
          // noop to prevent eslint error about missing 'item'. TODO: implement eslint disable comments support in pug
          - (item => {})(item)
          Div.star(
            key=index
            onPress=() => onChange && onChange(index + 1)
            styleName={first: index === 0}
          )
            Star(active=index < Math.round(value))
  `
}
