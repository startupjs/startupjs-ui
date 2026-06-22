const UNUSED_COLOR_VARIABLE = '--__startupjs-ui-unused-color'
const TOKEN_RE = /^[A-Za-z0-9_-]+$/
const CSS_VARIABLE_RE = /^--[A-Za-z0-9_-]+$/
const VAR_FUNCTION_RE = /^var\(\s*(--[A-Za-z0-9_-]+)\s*(?:,\s*(.*?))?\s*\)$/

export default function colorVariableRequest (color, { prefix = '--color' } = {}) {
  if (!color || typeof color !== 'string') {
    return {
      name: UNUSED_COLOR_VARIABLE
    }
  }

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

  if (isColorToken(trimmed)) {
    return {
      name: `${prefix}-${trimmed}`
    }
  }

  return {
    name: UNUSED_COLOR_VARIABLE,
    fallback: trimmed
  }
}

export function isColorToken (color) {
  return typeof color === 'string' && TOKEN_RE.test(color.trim())
}
