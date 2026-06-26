import { type ReactNode, type RefObject, useContext } from 'react'
import { StyleSheet, Text, type TextStyle, type StyleProp, type TextProps } from 'react-native'
import Animated from 'react-native-reanimated'
import { css, pug, observer, themed } from 'startupjs'
import { type UIRole } from '@startupjs-ui/core'

import {
  TextStyleContext,
  resolveSpanLineHeight
} from './textStyleContext'

export default themed('Span', observer(Span))

export const _PropsJsonSchema = {/* SpanProps */}

export interface SpanProps extends Omit<TextProps, 'role'> {
  /** Ref to access underlying <Text> */
  ref?: RefObject<any>
  /** Accessibility role. Includes RN roles plus web-only ARIA roles used by RNW. */
  role?: UIRole
  /** Web-only target input id when role='label'. */
  htmlFor?: string
  /** Custom styles applied to the root view */
  style?: StyleProp<TextStyle>
  /** Content rendered inside Span */
  children?: ReactNode
  /** bold text */
  bold?: boolean
  /** italic text */
  italic?: boolean
  /** full width (flex: 1) */
  full?: boolean
  /** description text color */
  description?: boolean
  /** Omit the default root typography (font size/family/weight and base color)
   * while still applying inherited text styles and animation handling. Useful
   * when the surrounding stylesheet fully controls typography. @default false */
  pure?: boolean
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
  /** @deprecated use h1-h6 props instead */
  variant?: 'default' | 'description' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

function Span ({
  ref,
  style,
  children,
  variant,
  bold,
  italic,
  full,
  description,
  pure,
  theme,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ...props
}: SpanProps): ReactNode {
  if (variant && variant !== 'default') {
    if (variant === 'description') {
      console.warn("[@startupjs/ui] Span: variant='description' is DEPRECATED, use prop description instead.")
    } else {
      console.warn(`[@startupjs/ui] Span: variant='${variant}' is DEPRECATED, use h1-h6 props or CSS variables instead.`)
    }
  }

  const tag = h1 ? 'h1' : h2 ? 'h2' : h3 ? 'h3' : h4 ? 'h4' : h5 ? 'h5' : h6 ? 'h6' : undefined

  const semanticProps: any = tag
    ? { role: 'heading', 'aria-level': Number(tag.replace(/^h/, '')) }
    : {}

  style = StyleSheet.flatten(style)

  const inheritedTextStyle = useContext(TextStyleContext)
  if (inheritedTextStyle) {
    style = {
      ...inheritedTextStyle,
      ...style
    }
  }
  style = resolveSpanLineHeight(style)
  const Component = hasAnimatedProperty(style) ? Animated.Text : Text

  const spanElement = pug`
    Component(
      ref=ref
      style=style
      styleName=[
        pure ? undefined : 'root',
        theme,
        variant,
        tag,
        { bold, italic, full, description }
      ]
      ...semanticProps
      ...props
    )= children
  `

  if (inheritedTextStyle) {
    return pug`
      TextStyleContext.Provider(value=undefined)
        = spanElement
    `
  }

  return spanElement
}

function hasAnimatedProperty (style: any): boolean {
  if (!style) return false
  return Object.keys(style).some(key => key.startsWith('animation') || key.startsWith('transition'))
}

css`
  .root {
    color: var(--Span-color);
    font-family: var(--Span-font-family);
    font-size: var(--Span-font-size);
    font-weight: var(--Span-font-weight);
    line-height: var(--Span-line-height);
  }

  .root.h1,
  .root.h2,
  .root.h3,
  .root.h4,
  .root.h5,
  .root.h6 {
    font-family: var(--Span-heading-font-family);
    font-weight: var(--Span-heading-font-weight);
  }

  .root.h1 {
    font-size: var(--Span-h1-font-size);
    line-height: var(--Span-h1-line-height);
  }

  .root.h2 {
    font-size: var(--Span-h2-font-size);
    line-height: var(--Span-h2-line-height);
  }

  .root.h3 {
    font-size: var(--Span-h3-font-size);
    line-height: var(--Span-h3-line-height);
  }

  .root.h4 {
    font-size: var(--Span-h4-font-size);
    line-height: var(--Span-h4-line-height);
  }

  .root.h5 {
    font-size: var(--Span-h5-font-size);
    line-height: var(--Span-h5-line-height);
  }

  .root.h6 {
    font-size: var(--Span-h6-font-size);
    line-height: var(--Span-h6-line-height);
  }

  .root.bold {
    font-weight: var(--Span-font-weight-bold);
  }

  .root.italic {
    font-style: italic;
  }

  .root.h1.bold,
  .root.h2.bold,
  .root.h3.bold,
  .root.h4.bold,
  .root.h5.bold,
  .root.h6.bold {
    font-weight: var(--Span-heading-font-weight-bold);
  }

  .root.description {
    color: var(--Span-description-color);
  }

  .root.full {
    flex: 1;
  }
`
