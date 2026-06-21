import { type ReactNode } from 'react'
import { pug, observer } from 'startupjs'
import { CssVariables, useCssVariablesMeta, StyleContext } from '@startupjs-ui/core'
import Portal from '@startupjs-ui/portal'
import { ToastProvider } from '@startupjs-ui/toast'
import DialogsProvider from '@startupjs-ui/dialogs/DialogsProvider'

export const _PropsJsonSchema = {/* UiProviderProps */}

export interface UiProviderProps {
  /** App content rendered inside the provider */
  children?: ReactNode
  /** CSSX style overrides (use ':root' for static overrides) */
  style?: Record<string, any> & {
    rootVariables?: Record<string, any>
  }
  /** Theme palette overrides */
  palette?: Record<string, any>
  /** Color overrides */
  colors?: Record<string, any>
  /** Component color overrides */
  componentColors?: Record<string, any>
}

function UiProvider ({
  children,
  style,
  palette,
  colors,
  componentColors
}: UiProviderProps): ReactNode {
  const staticOverrides = style?.rootVariables ?? style?.[':root']
  const cssVariablesMeta = useCssVariablesMeta({
    staticOverrides,
    palette,
    colors,
    componentColors
  })

  return pug`
    if cssVariablesMeta
      CssVariables(meta=cssVariablesMeta)

    StyleContext.Provider(value=style)
      Portal.Provider
        ToastProvider
        = children
      DialogsProvider
  `
}

export default observer(UiProvider)
