import {
  getCssVariable as getCssxVariable,
  useCssVariable
} from 'startupjs'

const UNUSED_VARIABLE = '--__startupjs-ui-unused-color'
const TOKEN_RE = /^[A-Za-z0-9_-]+$/
const CSS_VARIABLE_RE = /^--[A-Za-z0-9_-]+$/
const VAR_FUNCTION_RE = /^var\(\s*(--[A-Za-z0-9_-]+)\s*(?:,\s*(.*?))?\s*\)$/

export function useThemeColor (color, options) {
  const request = getThemeColorVariableRequest(color, options)
  const resolved = useCssVariable(request?.name ?? UNUSED_VARIABLE, request?.fallback)

  if (resolved != null) return String(resolved)
  if (!request && typeof color === 'string') return color
}

export function getThemeColor (color, options) {
  const request = getThemeColorVariableRequest(color, options)

  if (!request) return typeof color === 'string' ? color : undefined

  const resolved = getCssxVariable(request.name, request.fallback)
  return resolved == null ? undefined : String(resolved)
}

export function getThemeColorVariableName (color, options) {
  return getThemeColorVariableRequest(color, options)?.name
}

function getThemeColorVariableRequest (color, { prefix = '--color' } = {}) {
  if (!color || typeof color !== 'string') return

  const trimmed = color.trim()
  const varMatch = trimmed.match(VAR_FUNCTION_RE)
  if (varMatch) {
    return {
      name: varMatch[1],
      fallback: varMatch[2]
    }
  }

  if (CSS_VARIABLE_RE.test(trimmed)) {
    return {
      name: trimmed
    }
  }

  if (!TOKEN_RE.test(trimmed)) return

  return {
    name: `${prefix}-${trimmed}`
  }
}
