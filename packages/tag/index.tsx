import { type ReactNode } from 'react'
import { StyleSheet, type GestureResponderEvent, type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { Colors, colorToRGBA, themed, useColors } from '@startupjs-ui/core'
import Div, { type DivProps } from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'
import './index.cssx.styl'

const ICON_SIZES = {
  s: 's',
  m: 's'
}

export default observer(themed('Tag', Tag))

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
  color = Colors.primary,
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
  const getColor = useColors()

  if (!getColor(color)) {
    console.error(
      'Tag component: Color for color property is incorrect. ' +
      'Use colors from Colors'
    )
  }

  const isFlat = variant === 'flat'
  const _color = getColor(color)
  const rootStyle: StyleProp<ViewStyle> = {}
  let extraHoverStyle
  let extraActiveStyle

  textStyle = StyleSheet.flatten([
    { color: isFlat ? getFlatTextColor() : _color },
    textStyle
  ]) as StyleProp<TextStyle>
  iconStyle = StyleSheet.flatten([
    { color: isFlat ? getFlatTextColor() : _color },
    iconStyle
  ]) as StyleProp<TextStyle>
  secondaryIconStyle = StyleSheet.flatten([
    { color: isFlat ? getFlatTextColor() : _color },
    secondaryIconStyle
  ]) as StyleProp<TextStyle>

  switch (variant) {
    case 'flat':
      rootStyle.backgroundColor = _color as string
      break
    case 'outlined':
      rootStyle.borderColor = colorToRGBA(_color as string, 0.5)
      extraHoverStyle = { backgroundColor: colorToRGBA(_color as string, 0.05) }
      extraActiveStyle = { backgroundColor: colorToRGBA(_color as string, 0.25) }
      break
    case 'outlined-bg':
      rootStyle.borderColor = _color as string
      rootStyle.backgroundColor = colorToRGBA(_color as string, 0.15)
      extraHoverStyle = { backgroundColor: colorToRGBA(_color as string, 0.05) }
      extraActiveStyle = { backgroundColor: colorToRGBA(_color as string, 0.25) }
      break
  }

  function getFlatTextColor () {
    return getColor(`text-on-${color}`) ?? getColor('text-on-color')
  }

  return pug`
    Div.root(
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
            style=iconStyle
            icon=icon
            size=ICON_SIZES[size]
          )

      //- workaround when we interpolate variable into component
      //- const value = 0
      //- Tag= value
      if children != null
        Span.label(
          style=[textStyle]
          styleName=[size]
        )= children

      if secondaryIcon
        Div.iconWrapper.right(
          styleName=[size]
          onPress=onSecondaryIconPress
        )
          Icon.icon(
            style=secondaryIconStyle
            styleName=[variant, size]
            icon=secondaryIcon
            size=ICON_SIZES[size]
          )
  `
}
