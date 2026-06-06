import { createContext } from 'react'
import { StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native'

export type RelativeLineHeight = number | `${number}%` | `${number}`

export type UniversalTextStyle = Omit<TextStyle, 'lineHeight'> & {
  /**
   * RN normally expects absolute numeric lineHeight.
   *
   * Span additionally supports:
   *   lineHeight: 1.5    -> fontSize * 1.5
   *   lineHeight: '1.5'  -> fontSize * 1.5
   *   lineHeight: '150%' -> fontSize * 1.5
   *
   * Convention:
   *   numbers <= 4 are treated as multipliers
   *   numbers > 4 are treated as absolute RN lineHeight values
   */
  lineHeight?: TextStyle['lineHeight'] | RelativeLineHeight
}

export type InheritedTextStyle = Pick<
  UniversalTextStyle,
  | 'color'
  | 'fontFamily'
  | 'fontSize'
  | 'fontStyle'
  | 'fontWeight'
  | 'letterSpacing'
  | 'lineHeight'
  | 'textAlign'
  | 'textDecorationColor'
  | 'textDecorationLine'
  | 'textDecorationStyle'
  | 'textTransform'
  | 'writingDirection'
>

export type DivStyle = ViewStyle & InheritedTextStyle
export type SpanStyle = UniversalTextStyle

export const TextStyleContext = createContext<InheritedTextStyle | undefined>(undefined)

const inheritedTextStyleKeys = [
  'color',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'textAlign',
  'textDecorationColor',
  'textDecorationLine',
  'textDecorationStyle',
  'textTransform',
  'writingDirection'
] as const satisfies (keyof InheritedTextStyle)[]

export function getInheritedTextStyle (style: unknown): InheritedTextStyle | undefined {
  const flatStyle = StyleSheet.flatten(style as StyleProp<Record<string, unknown>>)
  if (!flatStyle) return undefined

  const textStyle: Partial<InheritedTextStyle> = {}
  let hasTextStyle = false

  for (const key of inheritedTextStyleKeys) {
    const value = flatStyle[key]

    if (value != null) {
      ;(textStyle as Record<string, unknown>)[key] = value
      hasTextStyle = true
    }
  }

  return hasTextStyle ? textStyle as InheritedTextStyle : undefined
}

export function omitInheritedTextStyle<TStyle = ViewStyle> (style: unknown): TStyle | undefined {
  const flatStyle = StyleSheet.flatten(style as StyleProp<Record<string, unknown>>)
  if (!flatStyle) return undefined

  const styleWithoutInheritedText = { ...flatStyle }

  for (const key of inheritedTextStyleKeys) {
    delete styleWithoutInheritedText[key]
  }

  return styleWithoutInheritedText as TStyle
}

export function mergeInheritedTextStyles (
  parentStyle: InheritedTextStyle | undefined,
  ownStyle: InheritedTextStyle
): InheritedTextStyle {
  return {
    ...parentStyle,
    ...ownStyle
  }
}

export function resolveSpanLineHeight (style: InheritedTextStyle): InheritedTextStyle {
  const fontSize = typeof style.fontSize === 'number'
    ? style.fontSize
    : undefined

  const { lineHeight } = style

  if (!fontSize || lineHeight == null) return style

  if (typeof lineHeight === 'number') {
    if (lineHeight > 0 && lineHeight <= 4) {
      return {
        ...style,
        lineHeight: Math.round(fontSize * lineHeight)
      }
    }

    return style
  }

  if (typeof lineHeight === 'string') {
    if (lineHeight.endsWith('%')) {
      const percent = Number(lineHeight.slice(0, -1))

      if (Number.isFinite(percent)) {
        return {
          ...style,
          lineHeight: Math.round((fontSize * percent) / 100)
        }
      }

      return style
    }

    const multiplier = Number(lineHeight)

    if (Number.isFinite(multiplier)) {
      return {
        ...style,
        lineHeight: Math.round(fontSize * multiplier)
      }
    }
  }

  return style
}
