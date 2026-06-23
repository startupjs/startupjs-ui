import { useEffect, type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, $, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'

export const _PropsJsonSchema = {/* TdProps */} // used in docs generation

export interface TdProps extends DivProps {
  /** Custom styles applied to the cell container */
  style?: StyleProp<ViewStyle>
  /** Cell content rendered inside */
  children?: ReactNode
  /** Collapse text into a single line with ellipsis, tap to toggle @default false */
  ellipsis?: boolean
}

function Td ({
  style,
  children,
  ellipsis = false,
  ...props
}: TdProps): ReactNode {
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
        )= children
      else
        = children

  `
}

export default themed('Td', observer(Td))

css`
  .root {
    padding: var(--Table-cell-padding-y) var(--Table-cell-padding-x);
    flex: 1;
  }
`
