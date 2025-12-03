import type React from 'react'
import { Platform, Text, type TextStyle, type StyleProp, type TextProps } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import './index.styl'

export const _PropsJsonSchema = {/* SpanProps */ }

export interface SpanProps extends TextProps {
  style?: StyleProp<TextStyle>
  children?: React.ReactNode
  /** @deprecated use h1-h6 props instead */
  variant?: 'default' | 'description' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  /** bold text */
  bold?: boolean
  /** italic text */
  italic?: boolean
  /** full width (flex: 1) */
  full?: boolean
  /** description text color */
  description?: boolean
  /** theme name */
  theme?: string
  /** h1 header */
  h1?: boolean
  /** h2 header */
  h2?: boolean
  /** h3 header */
  h3?: boolean
  /** h4 header */
  h4?: boolean
  /** h5 header */
  h5?: boolean
  /** h6 header */
  h6?: boolean
}

function Span ({
  style,
  children,
  variant,
  bold,
  italic,
  full,
  description,
  theme,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ...props
}: SpanProps): React.ReactNode {
  if (variant && variant !== 'default') {
    if (variant === 'description') {
      console.warn("[@startupjs/ui] Span: variant='description' is DEPRECATED, use prop description instead.")
    } else {
      console.warn(`[@startupjs/ui] Span: variant='${variant}' is DEPRECATED, use font(${variant}) mixin instead or h1-h6 props.`)
    }
  }

  const tag = h1 ? 'h1' : h2 ? 'h2' : h3 ? 'h3' : h4 ? 'h4' : h5 ? 'h5' : h6 ? 'h6' : undefined

  const role: any = Platform.OS === 'web' && tag
    ? { accessibilityRole: 'header', accessibilityLevel: tag.replace(/^h/, '') }
    : {}

  return pug`
    Text.root(
      style=style
      styleName=[
        theme,
        variant,
        tag,
        { bold, italic, full, description }
      ]
      ...role
      ...props
    )= children
  `
}

export default observer(themed('Span', Span))
