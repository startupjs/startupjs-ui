import { type TextStyle, type ViewStyle } from 'react-native'

export type RelativeLineHeight = number | `${number}%` | `${number}`

export type UniversalTextStyle = Omit<TextStyle, 'lineHeight'> & {
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

export declare const TextStyleContext: import('react').Context<InheritedTextStyle | undefined>

export declare function getInheritedTextStyle (style: unknown): InheritedTextStyle | undefined
export declare function omitInheritedTextStyle<TStyle = ViewStyle> (style: unknown): TStyle | undefined
export declare function mergeInheritedTextStyles (parentStyle: InheritedTextStyle | undefined, ownStyle: InheritedTextStyle): InheritedTextStyle
export declare function resolveSpanLineHeight (style: InheritedTextStyle): InheritedTextStyle
