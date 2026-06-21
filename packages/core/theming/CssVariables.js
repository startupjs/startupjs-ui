import { useEffect, useLayoutEffect } from 'react'
import { $, variables as singletonVariables } from 'startupjs'
// TODO: Move CssVariables to basic startupjs and also move the singleton variables file to some generic lib
//       so that it's not tightly coupled with our custom stylesheets implementation
import transformColors from './transformColors'

const useCommitEffect = typeof window === 'undefined'
  ? useEffect
  : useLayoutEffect

export default function CssVariables ({ meta, clear = true, children }) {
  function setColorScheme (value = '') {
    document.documentElement.style.colorScheme = value
  }

  useCommitEffect(() => {
    const isWeb = $.system.platform.get() === 'web'
    const isDark = isWeb ? document.documentElement.style.colorScheme === 'dark' : false

    if (!meta) {
      // default color scheme is light so we reset it to default if there are no overrides
      if (isDark) setColorScheme()
      return
    }

    const variables = transformColors(meta)

    setVariables(variables)

    if (isWeb) {
      if (singletonVariables['--color-bg-main']?.isDark?.()) {
        if (!isDark) setColorScheme('dark')
      } else {
        setColorScheme()
      }
    }

    // clear dynamic theme when destroyed
    if (clear) {
      return () => {
        if (isWeb) setColorScheme()
        clearVariables()
      }
    }
  }, [JSON.stringify(meta), clear])

  return children || null
}

function setVariables (variables) {
  if (typeof singletonVariables.set === 'function') {
    singletonVariables.set(variables)
    return
  }

  // set new variables
  for (const variableName in variables) {
    if (variables[variableName] !== singletonVariables[variableName]) {
      singletonVariables[variableName] = variables[variableName]
    }
  }

  // remove old variables
  for (const variableName in singletonVariables) {
    if (variables[variableName] == null) {
      delete singletonVariables[variableName]
    }
  }
}

function clearVariables () {
  if (typeof singletonVariables.clear === 'function') {
    singletonVariables.clear()
    return
  }

  for (const variableName in singletonVariables) {
    delete singletonVariables[variableName]
  }
}
