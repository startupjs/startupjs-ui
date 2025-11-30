import type React from 'react'
import { Platform, Text, type TextStyle, type StyleProp } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import './index.styl'

export const _PropsJsonSchema = {/* SpanProps */ }

export interface SpanProps {
  style?: StyleProp<TextStyle>
  children?: React.ReactNode
  variant?: 'default' | 'description' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  bold?: boolean
  italic?: boolean
  full?: boolean
  description?: boolean
  theme?: string
  h1?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  h5?: boolean
  h6?: boolean
}

async function Span ({
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
}: SpanProps) {
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

  return await pug`
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
