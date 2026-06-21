import { Children, useState, type ReactNode } from 'react'
import { StyleSheet, type GestureResponderEvent, type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { pug, observer, useIsMountedRef } from 'startupjs'
import { colorToRGBA, themed, useThemeColor } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Loader from '@startupjs-ui/loader'
import Span from '@startupjs-ui/span'
import STYLES from './index.cssx.styl'

const {
  config: {
    heights,
    outlinedBorderWidth,
    outlinedBorderColor,
    useBgColorForFlat,
    webNativeButton,
    iconMargins
  }
} = STYLES

function isConfigEnabled (value: unknown): boolean {
  return value !== false && value !== 0 && value !== '0'
}

export default observer(themed('Button', Button))

export const _PropsJsonSchema = {/* ButtonProps */} // used in docs generation
export interface ButtonProps {
  /** color name @default 'secondary' */
  color?: string
  /** variant @default 'outlined' */
  variant?: 'flat' | 'outlined' | 'text'
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
  color = 'secondary',
  variant = 'outlined',
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
  const isFlat = variant === 'flat'
  const _color = useThemeColor(color)
  const _flatBgColor = useThemeColor(`bg-${color}`)
  const _flatTextColor = useThemeColor(`text-on-${color}`)
  const _textOnColor = useThemeColor('text-on-color')
  const textColor = isFlat && _flatTextColor ? `text-on-${color}` : isFlat ? 'text-on-color' : color
  const _textColor = isFlat ? (_flatTextColor ?? _textOnColor) : _color

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

  if (!_color) console.error(`Button component: Unknown color token "${color}"`)

  const shouldUseBgColorForFlat = isConfigEnabled(useBgColorForFlat)
  const shouldUseWebNativeButton = isConfigEnabled(webNativeButton)
  const _colorString = _color ?? ''
  const hasChildren = Children.count(children)
  const height = heights[size] as number
  const rootStyle: Record<string, any> = { height }
  const rootExtraProps: Record<string, any> = {}
  const iconWrapperStyle: Record<string, any> = {}
  let extraHoverStyle: StyleProp<ViewStyle>
  let extraActiveStyle: StyleProp<ViewStyle>

  textStyle = StyleSheet.flatten<TextStyle>([
    { color: _textColor as any },
    textStyle
  ])
  iconStyle = StyleSheet.flatten<TextStyle>([
    { color: _textColor as any },
    iconStyle
  ])

  switch (variant) {
    case 'flat':
      rootStyle.backgroundColor = (shouldUseBgColorForFlat ? _flatBgColor : null) || _color
      break
    case 'outlined':
      rootStyle.borderWidth = outlinedBorderWidth
      rootStyle.borderColor = outlinedBorderColor || colorToRGBA(_colorString, 0.5)
      extraHoverStyle = { backgroundColor: colorToRGBA(_colorString, 0.05) }
      extraActiveStyle = { backgroundColor: colorToRGBA(_colorString, 0.25) }
      break
    case 'text':
      extraHoverStyle = { backgroundColor: colorToRGBA(_colorString, 0.05) }
      extraActiveStyle = { backgroundColor: colorToRGBA(_colorString, 0.25) }
      break
  }

  let padding: number
  const quarterOfHeight = height / 4

  if (hasChildren) {
    padding = height / 2

    switch (iconPosition) {
      case 'left':
        iconWrapperStyle.marginRight = iconMargins[size]
        iconWrapperStyle.marginLeft = -quarterOfHeight
        break
      case 'right':
        iconWrapperStyle.marginLeft = iconMargins[size]
        iconWrapperStyle.marginRight = -quarterOfHeight
        break
    }
  } else {
    padding = quarterOfHeight
  }

  if (variant === 'outlined') padding -= outlinedBorderWidth

  rootStyle.paddingLeft = padding
  rootStyle.paddingRight = padding

  return pug`
    Div.root(
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
      ...rootExtraProps
      ...props
    )
      if asyncActive
        Div.loader
          Loader(size='s' color=textColor)
      if icon
        Div.iconWrapper(
          style=iconWrapperStyle
          styleName=[
            { 'with-label': hasChildren },
            iconPosition
          ]
        )
          Icon.icon(
            style=iconStyle
            styleName=[variant, { invisible: asyncActive }]
            icon=icon
            size=size
          )
      if children != null
        Span.label(
          style=[textStyle]
          styleName=[size, { invisible: asyncActive }]
        )= children
  `
}
