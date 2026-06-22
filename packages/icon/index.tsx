import { type ReactNode } from 'react'
import { StyleSheet, Platform } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { pug, observer, u, useCssVariable } from 'startupjs'
import { colorVariableRequest, themed } from '@startupjs-ui/core'
import { customIcons } from './globalCustomIcons'
import STYLES from './index.cssx.styl'

const {
  config: {
    color: defaultColor,
    forceWebSize
  }
} = STYLES

const SIZES = {
  xs: u(1),
  s: u(1.5),
  m: u(2),
  l: u(2.5),
  xl: u(3),
  xxl: u(3.5)
}

export default observer(themed('Icon', Icon))

export const _PropsJsonSchema = {/* IconProps */}

export interface IconProps {
  /** Custom styles applied to the icon */
  style?: any
  /** Icon definition from FontAwesome, custom component or registered name */
  icon: object | string | (() => any)
  /** Icon size preset or numeric value @default 'm' */
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | number
  /** Additional props forwarded to the icon element */
  [key: string]: any
}

function isConfigEnabled (value: unknown): boolean {
  return value !== false && value !== 0 && value !== '0'
}

function Icon ({
  style,
  icon,
  size = 'm',
  ...props
}: IconProps): ReactNode {
  const _size = typeof size === 'string' ? SIZES[size] : size
  const colorRequest = colorVariableRequest(defaultColor)
  const color = useCssVariable(colorRequest.name, colorRequest.fallback) || defaultColor

  if (!icon) return null

  let CustomIcon

  style = StyleSheet.flatten([{ color }, style])

  if (typeof icon === 'function') {
    CustomIcon = icon
  } else if (typeof icon === 'string') {
    CustomIcon = customIcons[icon]
  }

  if (CustomIcon) {
    const { color: fill, width = _size, height = _size, ...iconStyle } = style
    iconStyle.color ??= fill
    return pug`
      CustomIcon(
        style=iconStyle
        color=fill
        width=width
        height=height
        fill=fill
        ...props
      )
    `
  }

  if (Platform.OS === 'web') {
    if (isConfigEnabled(forceWebSize)) {
      style.width = _size
      style.height = _size
    } else {
      style.width ??= _size
      style.height ??= _size
    }
    style.outline ??= 'none'
    return pug`
      FontAwesomeIcon(
        style=style
        icon=icon
        ...props
      )
    `
  } else {
    return pug`
      FontAwesomeIcon(
        style=style
        icon=icon
        size=_size
        ...props
      )
    `
  }
}
