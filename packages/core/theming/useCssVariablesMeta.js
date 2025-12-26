import { useMemo } from 'react'
import { setDefaultVariables } from 'startupjs'
import defaultPalette from './defaultPalette'
import defaultVariables from './defaultUiVariables'
import { transformOverrides } from './helpers'

// set default css variables as early as possible
setDefaultVariables(defaultVariables)

export default function useCssVariablesMeta ({ staticOverrides, palette, colors, componentColors }) {
  const cssVariablesMeta = useMemo(() => {
    // dynamic overrides take priority over static
    if (palette || colors || componentColors) return { palette, colors, componentColors }

    if (!staticOverrides) return

    const meta = { palette: {}, colors: {}, componentColors: {} }

    const transformedOverrides = transformOverrides(staticOverrides, defaultPalette.colors, defaultPalette.Color)

    for (const key in transformedOverrides) {
      const isColor = key.includes('--color')
      const isPaletteColor = key.includes('--palette')

      const value = transformedOverrides[key]

      const path = isPaletteColor
        ? 'palette'
        : isColor
          ? 'colors'
          : 'componentColors'

      meta[path][key] = value
    }

    return meta
  }, [ // eslint-disable-line react-hooks/exhaustive-deps
    JSON.stringify(staticOverrides), // eslint-disable-line react-hooks/exhaustive-deps
    JSON.stringify(palette), // eslint-disable-line react-hooks/exhaustive-deps
    JSON.stringify(colors), // eslint-disable-line react-hooks/exhaustive-deps
    JSON.stringify(componentColors) // eslint-disable-line react-hooks/exhaustive-deps
  ])
  return cssVariablesMeta
}
