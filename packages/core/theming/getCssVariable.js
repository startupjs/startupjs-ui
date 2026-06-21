import { getCssVariable as getCssxVariable } from 'startupjs'

export default function getCssVariable (cssVarName, { convertToString = true } = {}) {
  if (!/^--/.test(cssVarName)) throw Error('[getCssVariable]: Incorrect name format - must begin with --')

  const value = getCssxVariable(cssVarName)
  if (value == null) return

  return convertToString ? String(value) : value
}
