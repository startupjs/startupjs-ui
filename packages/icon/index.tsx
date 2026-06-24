import { type ReactNode } from 'react'
import { StyleSheet, Platform } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { css, pug, observer, useCssVariable, themed } from 'startupjs'
import { customIcons } from './globalCustomIcons'

const SIZES = {
  xs: 8,
  s: 12,
  m: 16,
  l: 20,
  xl: 24,
  xxl: 28
}

export default themed('Icon', observer(Icon))

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
  const color = useCssVariable('--Icon-color', 'var(--color-muted-foreground, #6b7280)')
  const forceWebSize = useCssVariable('--Icon-force-web-size', 0)

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
        styleName='root'
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
        styleName='root'
        icon=icon as any
        ...props
      )
    `
  } else {
    return pug`
      FontAwesomeIcon(
        style=style
        styleName='root'
        icon=icon as any
        size=_size
        ...props
      )
    `
  }
}

css`
  .root {
    color: var(--Icon-color);
  }
`
