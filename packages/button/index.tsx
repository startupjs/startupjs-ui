import { Children, useState, type ReactNode } from 'react'
import { StyleSheet, type GestureResponderEvent, type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { css, pug, observer, useCssColor, useCssVariable, useIsMountedRef, themed } from 'startupjs'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Loader from '@startupjs-ui/loader'
import Span from '@startupjs-ui/span'

const HEIGHT_FALLBACKS = {
  xs: 16,
  s: 24,
  m: 32,
  l: 40,
  xl: 48,
  xxl: 56
}

const ICON_MARGIN_FALLBACKS = {
  xs: 4,
  s: 4,
  m: 8,
  l: 8,
  xl: 12,
  xxl: 12
}

const COLOR_TOKEN_RE = /^[A-Za-z][A-Za-z0-9_-]*$/

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'flat'
  | 'outlined'
  | 'text'

type CanonicalButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'

const DEPRECATED_VARIANT_ALIASES: Partial<Record<ButtonVariant, CanonicalButtonVariant>> = {
  flat: 'default',
  outlined: 'outline',
  text: 'ghost'
}

const warnedVariantAliases = new Set<string>()

function isConfigEnabled (value: unknown): boolean {
  return value !== false && value !== 0 && value !== '0'
}

function isSemanticColorToken (value: string): boolean {
  return COLOR_TOKEN_RE.test(value.trim())
}

function toNumber (value: unknown, fallback: number): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function isCustomBorderColor (value: unknown): value is string {
  return typeof value === 'string' && value !== '' && value !== 'transparent'
}

function normalizeVariant (variant: ButtonVariant): CanonicalButtonVariant {
  const nextVariant = DEPRECATED_VARIANT_ALIASES[variant]
  if (!nextVariant) return variant as CanonicalButtonVariant

  if (!warnedVariantAliases.has(variant)) {
    warnedVariantAliases.add(variant)
    console.warn(
      `[@startupjs/ui] Button: variant='${variant}' is deprecated, use variant='${nextVariant}' instead.`
    )
  }

  return nextVariant
}

export default themed('Button', observer(Button))

export const _PropsJsonSchema = {/* ButtonProps */} // used in docs generation
export interface ButtonProps {
  /** color name */
  color?: string
  /** variant @default 'default' */
  variant?: ButtonVariant
  /** size @default 'm' */
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'
  /** icon component */
  icon?: object | string | (() => any)
  /** shape @default 'rounded' */
  shape?: 'squared' | 'rounded' | 'circle'
  /** icon position relative to label @default 'left' */
  iconPosition?: 'left' | 'right'
  /** disable button */
  disabled?: boolean
  /** button label text or a custom react node */
  children?: ReactNode
  /** custom styles for root element */
  style?: StyleProp<ViewStyle>
  /** custom styles for icon */
  iconStyle?: StyleProp<TextStyle>
  /** custom styles for label text */
  textStyle?: StyleProp<TextStyle>
  /** custom styles for hover state */
  hoverStyle?: StyleProp<ViewStyle>
  /** custom styles for active state */
  activeStyle?: StyleProp<ViewStyle>
  /** Accessible name for icon-only or custom-content buttons */
  'aria-label'?: string
  /** onPress handler */
  onPress?: (event: GestureResponderEvent) => void | Promise<void>
  /** Additional props forwarded to the root pressable */
  [key: string]: any
}
function Button ({
  style,
  iconStyle,
  textStyle,
  children,
  color,
  variant = 'default',
  size = 'm',
  shape = 'rounded',
  icon,
  iconPosition = 'left',
  disabled,
  hoverStyle,
  activeStyle,
  onPress,
  ...props
}: ButtonProps): ReactNode {
  const isMountedRef = useIsMountedRef()
  const [asyncActive, setAsyncActive] = useState(false)
  const normalizedVariant = normalizeVariant(variant)
  const hasCustomColor = color != null && color !== ''
  const colorToken = color ?? (
    normalizedVariant === 'destructive'
      ? 'destructive'
      : normalizedVariant === 'secondary'
        ? 'secondary'
        : 'primary'
  )
  const isSemanticColor = isSemanticColorToken(colorToken)
  const foregroundToken = isSemanticColor ? `${colorToken}-foreground` : 'primary-foreground'
  const resolvedColor = useCssColor(colorToken)
  const resolvedForegroundColor = useCssColor(foregroundToken)
  const fallbackForegroundColor = useCssColor('primary-foreground')
  const customBorderColor = useCssColor(colorToken, 0.5)
  const customHoverColor = useCssColor(colorToken, 0.05)
  const customActiveColor = useCssColor(colorToken, 0.25)
  const backgroundColor = useCssColor('background')
  const foregroundColor = useCssColor('foreground')
  const inputColor = useCssColor('input')
  const accentColor = useCssColor('accent')
  const primaryColor = useCssColor('primary')
  const deprecatedOutlinedBorderColor = useCssVariable('--Button-outlined-border-color', 'transparent')
  const customOutlineBorderColor = useCssVariable('--Button-outline-border-color', deprecatedOutlinedBorderColor)
  const webNativeButton = useCssVariable('--Button-web-native-button', 1)
  const height = toNumber(useCssVariable(`--Button-height-${size}`), HEIGHT_FALLBACKS[size])
  const iconMargin = toNumber(useCssVariable(`--Button-icon-margin-${size}`), ICON_MARGIN_FALLBACKS[size])
  const deprecatedOutlinedBorderWidth = useCssVariable('--Button-outlined-border-width', 1)
  const outlineBorderWidth = toNumber(useCssVariable('--Button-outline-border-width', deprecatedOutlinedBorderWidth), 1)
  const baseColor = resolvedColor ?? colorToken
  const onColor = resolvedForegroundColor ?? fallbackForegroundColor
  let textColor = foregroundColor ?? 'var(--color-foreground)'
  let loaderColor = 'primary-foreground'

  async function _onPress (event: GestureResponderEvent) {
    if (!onPress) return
    let resolved = false
    const promise = onPress(event)
    if (!(promise && promise.then)) return
    promise.then(
      () => { resolved = true },
      () => { resolved = true }
    )
    await new Promise((resolve) => setTimeout(resolve, 0))
    if (resolved) return
    setAsyncActive(true)
    try {
      await promise
    } finally {
      if (isMountedRef.current) setAsyncActive(false)
    }
  }

  if (!resolvedColor && isSemanticColor) console.error(`Button component: Unknown color token "${colorToken}"`)

  const shouldUseWebNativeButton = isConfigEnabled(webNativeButton)
  const hasChildren = Children.count(children)
  const rootStyle: Record<string, any> = { height }
  const iconWrapperStyle: Record<string, any> = {}
  let extraHoverStyle: StyleProp<ViewStyle>
  let extraActiveStyle: StyleProp<ViewStyle>
  const customStateHoverColor = hasCustomColor ? customHoverColor : accentColor
  const customStateActiveColor = hasCustomColor ? customActiveColor : accentColor

  switch (normalizedVariant) {
    case 'default':
      rootStyle.backgroundColor = baseColor
      textColor = onColor ?? textColor
      loaderColor = isSemanticColor ? foregroundToken : 'primary-foreground'
      break
    case 'destructive':
      rootStyle.backgroundColor = baseColor
      textColor = onColor ?? textColor
      loaderColor = isSemanticColor ? foregroundToken : 'destructive-foreground'
      break
    case 'secondary':
      rootStyle.backgroundColor = baseColor
      textColor = onColor ?? textColor
      loaderColor = isSemanticColor ? foregroundToken : 'secondary-foreground'
      break
    case 'outline':
      rootStyle.borderWidth = outlineBorderWidth
      rootStyle.borderColor = isCustomBorderColor(customOutlineBorderColor)
        ? customOutlineBorderColor
        : hasCustomColor
          ? customBorderColor
          : inputColor
      rootStyle.backgroundColor = backgroundColor
      textColor = hasCustomColor ? baseColor : (foregroundColor ?? textColor)
      if (customStateHoverColor) extraHoverStyle = { backgroundColor: customStateHoverColor }
      if (customStateActiveColor) extraActiveStyle = { backgroundColor: customStateActiveColor }
      break
    case 'ghost':
      textColor = hasCustomColor ? baseColor : (foregroundColor ?? textColor)
      if (customStateHoverColor) extraHoverStyle = { backgroundColor: customStateHoverColor }
      if (customStateActiveColor) extraActiveStyle = { backgroundColor: customStateActiveColor }
      break
    case 'link':
      textColor = hasCustomColor ? baseColor : (primaryColor ?? textColor)
      break
  }

  textStyle = StyleSheet.flatten<TextStyle>([
    {
      color: textColor as any,
      textDecorationLine: normalizedVariant === 'link' ? 'underline' : 'none'
    },
    textStyle
  ])
  iconStyle = StyleSheet.flatten<TextStyle>([
    { color: textColor as any },
    iconStyle
  ])

  let padding: number
  const quarterOfHeight = height / 4

  if (hasChildren) {
    padding = height / 2

    switch (iconPosition) {
      case 'left':
        iconWrapperStyle.marginRight = iconMargin
        iconWrapperStyle.marginLeft = -quarterOfHeight
        break
      case 'right':
        iconWrapperStyle.marginLeft = iconMargin
        iconWrapperStyle.marginRight = -quarterOfHeight
        break
    }
  } else {
    padding = quarterOfHeight
  }

  if (normalizedVariant === 'outline') padding -= outlineBorderWidth

  rootStyle.paddingLeft = padding
  rootStyle.paddingRight = padding

  return pug`
    Div.root(
      part='root'
      row
      _webNativeButton=shouldUseWebNativeButton
      shape=shape
      style=[rootStyle, style]
      styleName=[
        size,
        { disabled }
      ]
      align='center'
      vAlign='center'
      reverse=iconPosition === 'right'
      variant='highlight'
      hoverStyle=extraHoverStyle ? [extraHoverStyle, hoverStyle] : hoverStyle
      activeStyle=extraActiveStyle ? [extraActiveStyle, activeStyle] : activeStyle
      disabled=asyncActive || disabled
      onPress=onPress ? _onPress : undefined
      ...props
    )
      if asyncActive
        Div.loader(part='loader')
          Loader(size='s' color=loaderColor)
      if icon
        Div.iconWrapper(
          style=iconWrapperStyle
          styleName=[
            { 'with-label': hasChildren },
            iconPosition
          ]
        )
          Icon.icon(
            part='icon'
            style=iconStyle
            styleName=[normalizedVariant, { invisible: asyncActive }]
            icon=icon
            size=size
          )
      if children != null
        Span.label(
          part='text'
          style=[textStyle]
          styleName=[size, { invisible: asyncActive }]
        )= children
  `
}

css`
  .root.disabled {
    opacity: var(--Button-disabled-opacity);
  }

  .label {
    font-weight: var(--Button-font-weight);
  }

  .label.invisible,
  .icon.invisible {
    opacity: 0;
  }

  .label.xs {
    font-size: var(--Button-font-size-xs);
    line-height: var(--Button-line-height-xs);
  }

  .label.s {
    font-size: var(--Button-font-size-s);
    line-height: var(--Button-line-height-s);
  }

  .label.m {
    font-size: var(--Button-font-size-m);
    line-height: var(--Button-line-height-m);
  }

  .label.l {
    font-size: var(--Button-font-size-l);
    line-height: var(--Button-line-height-l);
  }

  .label.xl {
    font-size: var(--Button-font-size-xl);
    line-height: var(--Button-line-height-xl);
  }

  .label.xxl {
    font-size: var(--Button-font-size-xxl);
    line-height: var(--Button-line-height-xxl);
  }

  .loader {
    position: absolute;
  }
`
