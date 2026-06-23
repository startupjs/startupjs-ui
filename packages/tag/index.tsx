import { type ReactNode } from 'react'
import { StyleSheet, type GestureResponderEvent, type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { css, pug, observer, useCssColor, themed } from 'startupjs'
import Div, { type DivProps } from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'

const ICON_SIZES = {
  s: 's',
  m: 's'
} as const

const COLOR_TOKEN_RE = /^[A-Za-z][A-Za-z0-9_-]*$/

function isSemanticColorToken (value: string): boolean {
  return COLOR_TOKEN_RE.test(value.trim())
}

export default themed('Tag', observer(Tag))

export const _PropsJsonSchema = {/* TagProps */}

export interface TagProps extends Omit<DivProps, 'variant'> {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the label text */
  textStyle?: StyleProp<TextStyle>
  /** Tag content */
  children?: ReactNode
  /** Tag color name @default 'primary' */
  color?: string
  /** Tag appearance variant @default 'flat' */
  variant?: 'flat' | 'outlined' | 'outlined-bg'
  /** Tag size preset @default 'm' */
  size?: 's' | 'm'
  /** Icon displayed on the left side */
  icon?: object | (() => any)
  /** Custom styles applied to the left icon */
  iconStyle?: StyleProp<TextStyle>
  /** Icon displayed on the right side */
  secondaryIcon?: object | (() => any)
  /** Custom styles applied to the right icon */
  secondaryIconStyle?: StyleProp<TextStyle>
  /** Disable interactions and apply disabled styles */
  disabled?: boolean
  /** Custom style for hover state */
  hoverStyle?: StyleProp<ViewStyle>
  /** Custom style for active state */
  activeStyle?: StyleProp<ViewStyle>
  /** Shape of the tag corners @default 'circle' */
  shape?: 'circle' | 'rounded'
  /** Handler for tag press */
  onPress?: (event: GestureResponderEvent) => void
  /** Handler for left icon press */
  onIconPress?: (event: GestureResponderEvent) => void
  /** Handler for right icon press */
  onSecondaryIconPress?: (event: GestureResponderEvent) => void
}

function Tag ({
  style,
  textStyle,
  children,
  color = 'primary',
  variant = 'flat',
  size = 'm',
  icon,
  iconStyle,
  secondaryIcon,
  secondaryIconStyle,
  disabled,
  hoverStyle,
  activeStyle,
  onPress,
  onIconPress,
  onSecondaryIconPress,
  shape = 'circle',
  ...props
}: TagProps): ReactNode {
  const isSemanticColor = isSemanticColorToken(color)
  const foregroundToken = isSemanticColor ? `${color}-foreground` : 'primary-foreground'
  const resolvedColor = useCssColor(color)
  const resolvedForegroundColor = useCssColor(foregroundToken)
  const fallbackForegroundColor = useCssColor('primary-foreground')
  const outlinedBorderColor = useCssColor(color, 0.5)
  const hoverColor = useCssColor(color, 0.05)
  const activeColor = useCssColor(color, 0.25)
  const subtleColor = useCssColor(color, 0.15)

  if (!resolvedColor && isSemanticColor) console.error(`Tag component: Unknown color token "${color}"`)

  const isFlat = variant === 'flat'
  const _color = resolvedColor ?? color
  const flatTextColor = resolvedForegroundColor ?? fallbackForegroundColor
  const rootStyle: StyleProp<ViewStyle> = {}
  let extraHoverStyle
  let extraActiveStyle

  textStyle = StyleSheet.flatten([
    { color: isFlat ? flatTextColor : _color },
    textStyle
  ]) as StyleProp<TextStyle>
  iconStyle = StyleSheet.flatten([
    { color: isFlat ? flatTextColor : _color },
    iconStyle
  ]) as StyleProp<TextStyle>
  secondaryIconStyle = StyleSheet.flatten([
    { color: isFlat ? flatTextColor : _color },
    secondaryIconStyle
  ]) as StyleProp<TextStyle>

  switch (variant) {
    case 'flat':
      rootStyle.backgroundColor = _color
      break
    case 'outlined':
      rootStyle.borderColor = outlinedBorderColor
      extraHoverStyle = hoverColor ? { backgroundColor: hoverColor } : undefined
      extraActiveStyle = activeColor ? { backgroundColor: activeColor } : undefined
      break
    case 'outlined-bg':
      rootStyle.borderColor = _color
      rootStyle.backgroundColor = subtleColor
      extraHoverStyle = hoverColor ? { backgroundColor: hoverColor } : undefined
      extraActiveStyle = activeColor ? { backgroundColor: activeColor } : undefined
      break
  }

  return pug`
    Div.root(
      part='root'
      style=[rootStyle, style]
      styleName=[
        variant,
        size,
        { disabled }
      ]
      variant='highlight'
      hoverStyle=extraHoverStyle ? [extraHoverStyle, hoverStyle] : hoverStyle
      activeStyle=extraActiveStyle ? [extraActiveStyle, activeStyle] : activeStyle
      disabled=disabled
      onPress=onPress
      shape=shape
      ...props
    )
      if icon
        Div.iconWrapper.left(
          styleName=[size]
          onPress=onIconPress
        )
          Icon(
            part='icon'
            style=iconStyle
            icon=icon
            size=ICON_SIZES[size]
          )

      //- workaround when we interpolate variable into component
      //- const value = 0
      //- Tag= value
      if children != null
        Span.label(
          part='text'
          style=[textStyle]
          styleName=[size]
        )= children

      if secondaryIcon
        Div.iconWrapper.right(
          styleName=[size]
          onPress=onSecondaryIconPress
        )
          Icon.icon(
            part='secondaryIcon'
            style=secondaryIconStyle
            styleName=[variant, size]
            icon=secondaryIcon
            size=ICON_SIZES[size]
          )
  `
}

css`
  .root {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .root.s {
    height: var(--Tag-height-s);
    padding-left: var(--Tag-padding-x-s);
    padding-right: var(--Tag-padding-x-s);
  }

  .root.m {
    height: var(--Tag-height-m);
    padding-left: var(--Tag-padding-x-m);
    padding-right: var(--Tag-padding-x-m);
  }

  .root.disabled {
    opacity: var(--Tag-disabled-opacity);
  }

  .root.outlined,
  .root.outlined-bg {
    border-width: var(--Tag-outlined-border-width);
  }

  .label {
    font-weight: var(--Tag-font-weight);
  }

  .label.s {
    font-size: var(--Tag-font-size-s);
    line-height: var(--Tag-line-height-s);
  }

  .label.m {
    font-size: var(--Tag-font-size-m);
    line-height: var(--Tag-line-height-m);
  }

  .iconWrapper.left.s {
    margin-right: var(--Tag-icon-inside-margin-s);
    margin-left: var(--Tag-icon-outside-margin-s);
  }

  .iconWrapper.left.m {
    margin-right: var(--Tag-icon-inside-margin-m);
    margin-left: var(--Tag-icon-outside-margin-m);
  }

  .iconWrapper.right.s {
    margin-left: var(--Tag-icon-inside-margin-s);
    margin-right: var(--Tag-icon-outside-margin-s);
  }

  .iconWrapper.right.m {
    margin-left: var(--Tag-icon-inside-margin-m);
    margin-right: var(--Tag-icon-outside-margin-m);
  }
`
