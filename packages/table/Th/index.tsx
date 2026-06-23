import { useEffect, type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, $, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'

export const _PropsJsonSchema = {/* ThProps */} // used in docs generation

export interface ThProps extends DivProps {
  /** Custom styles applied to the header cell container */
  style?: StyleProp<ViewStyle>
  /** Header cell content rendered inside */
  children?: ReactNode
  /** Collapse text into a single line with ellipsis, tap to toggle @default false */
  ellipsis?: boolean
}

function Th ({
  style,
  children,
  ellipsis = false,
  ...props
}: ThProps): ReactNode {
  const $full = $()

  useEffect(() => () => $full.del(), [$full])

  const options: Record<string, any> = {}

  if (ellipsis) {
    options.onPress = () => $full.set(!$full.get())
    if (!$full.get()) {
      options.numberOfLines = 1
      options.ellipsizeMode = 'tail'
    }
  }

  return pug`
    Div.root(
      part='root'
      ...props
      style=style
    )
      if typeof children === 'string'
        Span(
          ...options
          bold
        )= children
      else
        = children

  `
}

export default observer(themed('Th', Th))

css`
  .root {
    padding: var(--Table-cell-padding-y) var(--Table-cell-padding-x);
    flex: 1;
  }
`
