import { createElement as el } from 'react'
import { createPlugin, ROOT_MODULE as MODULE } from 'startupjs/registry'
import { setCustomInputs } from '@startupjs-ui/input/globalCustomInputs'
import { setCustomIcons } from '@startupjs-ui/icon/globalCustomIcons'
import Portal from '@startupjs-ui/portal'
import UiProvider from './UiProvider'

let hasCustomElementsInitialized = false

export default createPlugin({
  name: 'ui',
  enabled: true,
  order: 'system ui',
  client: ({ routerPortal = false, ...props } = {}) => ({
    renderRoot ({ children, style, theme }) {
      if (!hasCustomElementsInitialized) {
        hasCustomElementsInitialized = true
        const mergePlugins = (hookName, errorMessage, setFunction) => {
          const data = MODULE.hook(hookName)
            .reduce((allItems, pluginItems = {}) => {
              for (const item in pluginItems) {
                if (allItems[item]) {
                  console.warn(errorMessage(item))
                }
              }
              return { ...allItems, ...pluginItems }
            }, {})
          setFunction(data)
        }
        mergePlugins('customIcons', ERRORS.iconAlreadyDefined, setCustomIcons)
        mergePlugins('customInputs', ERRORS.inputAlreadyDefined, setCustomInputs)
      }
      const providerStyle = props.style == null ? style : [props.style, style]
      return el(UiProvider, {
        ...props,
        style: providerStyle,
        theme: theme ?? props.theme
      }, children)
    },
    renderRouter ({ children }) {
      if (!routerPortal) return children
      return el(Portal.Provider, null, children)
    }
  })
})

const ERRORS = {
  inputAlreadyDefined: input => `
    Custom input type "${input}" is already defined by another plugin. It will be overridden!
  `,
  iconAlreadyDefined: icon => `
    Custom icons "${icon}" is already defined by another plugin. It will be overridden!
  `
}
