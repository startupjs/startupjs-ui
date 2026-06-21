import React, { useContext } from 'react'
import { themed as cssxThemed } from 'startupjs'
import ThemeContext from './ThemeContext'

export default function themed (name, Component) {
  if (typeof name !== 'string') {
    Component = name
    name = Component.displayName || Component.name
  }

  function ThemeWrapper (props, ref) {
    const contextTheme = useContext(ThemeContext)
    const theme = props.theme || contextTheme
    let res
    if (theme && !props.theme) {
      res = Component({ theme, ...props }, ref)
    } else {
      res = Component(props, ref)
    }
    return (props.theme && (!contextTheme || contextTheme !== props.theme))
      ? (
          React.createElement(
            ThemeContext.Provider,
            { value: props.theme },
            res
          )
        )
      : res
  }

  ThemeWrapper.displayName = Component.displayName || Component.name
  ThemeWrapper.propTypes = Component.propTypes
  ThemeWrapper.defaultProps = Component.defaultProps

  const CssxThemeWrapper = cssxThemed(name, ThemeWrapper)
  CssxThemeWrapper.displayName = ThemeWrapper.displayName
  CssxThemeWrapper.propTypes = Component.propTypes
  CssxThemeWrapper.defaultProps = Component.defaultProps

  return CssxThemeWrapper
}
