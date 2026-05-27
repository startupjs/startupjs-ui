import { type ReactNode } from 'react'
import { StyleSheet, Platform } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { pug, observer, u } from 'startupjs'
import { Colors, themed, useColors } from '@startupjs-ui/core'
import { customIcons } from './globalCustomIcons'

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

function Icon ({
  style,
  icon,
  size = 'm',
  ...props
}: IconProps): ReactNode {
  const getColor = useColors()
  const _size = typeof size === 'string' ? SIZES[size] : size

  if (!icon) return null

  let CustomIcon

  style = StyleSheet.flatten([{ color: getColor(Colors['text-secondary']) }, style])

  if (typeof icon === 'function') {
    CustomIcon = icon
  } else if (typeof icon === 'string') {
    CustomIcon = customIcons[icon]
  }

  if (CustomIcon) {
    const { color: fill, width = _size, height = _size, ...iconStyle } = style
    return pug`
      CustomIcon(
        style=iconStyle
        width=width
        height=height
        fill=fill
        ...props
      )
    `
  }

  if (Platform.OS === 'web') {
    style.width ??= _size
    style.height ??= _size
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
