import React from 'react'
import { pug, observer } from 'startupjs'
// import ToastProvider from './components/toast/ToastProvider'
// import DialogsProvider from './components/dialogs/DialogsProvider'
// import Portal from './components/Portal'
import CssVariables from './theming/CssVariables'
import useCssVariablesMeta from './theming/useCssVariablesMeta'
import StyleContext from './theming/StyleContext'

export default observer(function UiProvider ({ children, style, palette, colors, componentColors }) {
  const staticOverrides = style?.[':root']

  const cssVariablesMeta = useCssVariablesMeta({ staticOverrides, palette, colors, componentColors })

  return pug`
    if cssVariablesMeta
      CssVariables(meta=cssVariablesMeta)

    StyleContext.Provider(value=style)
      = children
      // Portal.Provider
      //   ToastProvider
      //   = children
      // DialogsProvider
  `
})
