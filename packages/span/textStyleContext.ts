import { createContext } from 'react'
import { type TextStyle } from 'react-native'

export type InheritedTextStyle = Pick<
  TextStyle,
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

export function getInheritedTextStyle (style: object | undefined): InheritedTextStyle | undefined {
  if (!style) return undefined

  const styleRecord = style as Record<string, any>
  const textStyle: Partial<InheritedTextStyle> = {}
  let hasTextStyle = false

  for (const key of inheritedTextStyleKeys) {
    const value = styleRecord[key]

    if (value != null) {
      ;(textStyle as Record<string, unknown>)[key] = value
      hasTextStyle = true
    }
  }

  return hasTextStyle ? textStyle as InheritedTextStyle : undefined
}

export function omitInheritedTextStyle<TStyle extends object> (style: TStyle | undefined): TStyle | undefined {
  if (!style) return undefined

  const styleRecord = style as Record<string, any>
  for (const key of inheritedTextStyleKeys) {
    delete styleRecord[key]
  }

  return style
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

export function resolveSpanLineHeight<TStyle extends TextStyle | undefined> (style: TStyle): TStyle {
  if (!style) return style

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
      } as TStyle
    }

    return style
  }

  return style
}
