import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Div from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import Star from './Star'

const AMOUNT = 5
const ITEMS = Array(AMOUNT).fill(null)

export default observer(themed('Rating', Rating))

export const _PropsJsonSchema = {/* RatingProps */}

export interface RatingProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to each star wrapper */
  starStyle?: StyleProp<ViewStyle>
  /** Custom styles applied to the readonly value label */
  valueStyle?: StyleProp<any>
  /** Rating value displayed with stars @default 0 */
  value?: number
  /** Disable interactions and show compact view */
  readonly?: boolean
  /** Handler called when user selects a value */
  onChange?: (value: number) => void
  /** Test identifier */
  testID?: string
}

function Rating ({
  style,
  value = 0,
  readonly = false,
  onChange,
  testID
}: RatingProps): ReactNode {
  return pug`
    Div(part='root' style=style testID=testID vAlign='center' row)
      if readonly
        Star(active part='star')
        Span.value(part='value' bold h6)= value.toFixed(1)
      else
        each item, index in ITEMS
          // noop to prevent eslint error about missing 'item'. TODO: implement eslint disable comments support in pug
          - (item => {})(item)
          Div.star(
            part='star'
            key=index
            onPress=() => onChange && onChange(index + 1)
            styleName={ first: index === 0 }
          )
            Star(active=index < Math.round(value))
  `
}

css`
  .value {
    margin-left: var(--Rating-gap);
  }

  .star {
    margin-left: var(--Rating-gap);
  }

  .star.first {
    margin-left: 0;
  }
`
