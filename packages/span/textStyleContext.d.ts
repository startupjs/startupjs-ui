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

export declare const TextStyleContext: import('react').Context<InheritedTextStyle | undefined>

export declare function getInheritedTextStyle (style: object | undefined): InheritedTextStyle | undefined
export declare function omitInheritedTextStyle<TStyle extends object> (style: TStyle | undefined): TStyle | undefined
export declare function mergeInheritedTextStyles (parentStyle: InheritedTextStyle | undefined, ownStyle: InheritedTextStyle): InheritedTextStyle
export declare function resolveSpanLineHeight<TStyle extends TextStyle | undefined> (style: TStyle): TStyle
