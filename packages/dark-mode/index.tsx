import { type ReactNode } from 'react'
import { type GestureResponderEvent } from 'react-native'
import { pug, observer, themed, useTheme } from 'startupjs'
import Button, { type ButtonProps } from '@startupjs-ui/button'
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon'
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun'

export default themed('DarkMode', observer(DarkMode))

export const _PropsJsonSchema = {/* DarkModeProps */}

export interface DarkModeProps extends Omit<ButtonProps, 'icon' | 'children' | 'onPress'> {
  /** custom button content */
  children?: ReactNode
  /** icon shown while the current theme is light */
  lightIcon?: ButtonProps['icon']
  /** icon shown while the current theme is dark */
  darkIcon?: ButtonProps['icon']
  /** onPress handler called after the theme preference is toggled */
  onPress?: (event: GestureResponderEvent) => void | Promise<void>
}

function DarkMode ({
  children,
  lightIcon = faMoon,
  darkIcon = faSun,
  variant = 'ghost',
  color = 'text-description',
  shape = 'circle',
  onPress,
  ...props
}: DarkModeProps): ReactNode {
  const [theme, setTheme] = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'
  const ariaLabel = props['aria-label'] ?? label

  function _onPress (event: GestureResponderEvent) {
    setTheme(isDark ? 'light' : 'dark')
    return onPress?.(event)
  }

  return pug`
    Button(
      part='root'
      ...props
      aria-label=ariaLabel
      variant=variant
      color=color
      shape=shape
      icon=isDark ? darkIcon : lightIcon
      onPress=_onPress
    )= children
  `
}
