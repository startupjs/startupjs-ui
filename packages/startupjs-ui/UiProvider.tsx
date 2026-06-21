import {
  useEffect,
  useLayoutEffect,
  type ReactNode
} from 'react'
import {
  CssxProvider,
  pug,
  observer,
  useCssVariable,
  type CssxProviderStyleInput
} from 'startupjs'
import Portal from '@startupjs-ui/portal'
import { ToastProvider } from '@startupjs-ui/toast'
import DialogsProvider from '@startupjs-ui/dialogs/DialogsProvider'
import defaultTheme from './defaultTheme.js'

export const _PropsJsonSchema = {/* UiProviderProps */}

const useCommitEffect = typeof window === 'undefined'
  ? useEffect
  : useLayoutEffect

export interface UiProviderProps {
  /** App content rendered inside the provider */
  children?: ReactNode
  /** CSSX style overrides. Use :root for theme variables and tag selectors for component defaults. */
  style?: CssxProviderStyleInput
}

function UiProvider ({
  children,
  style
}: UiProviderProps): ReactNode {
  return pug`
    CssxProvider(style=[defaultTheme, style])
      ColorSchemeSync
      Portal.Provider
        ToastProvider
        = children
      DialogsProvider
  `
}

function ColorSchemeSync (): null {
  const backgroundColor = useCssVariable('--color-bg-main')

  useCommitEffect(() => {
    if (typeof document === 'undefined') return

    document.documentElement.style.colorScheme = isDarkColor(backgroundColor)
      ? 'dark'
      : ''

    return () => {
      document.documentElement.style.colorScheme = ''
    }
  }, [backgroundColor])

  return null
}

function isDarkColor (value: unknown): boolean {
  if (typeof value !== 'string') return false

  const rgb = parseRgb(value)
  if (!rgb) return false

  const [r, g, b] = rgb.map(channel => {
    const normalized = channel / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.5
}

function parseRgb (value: string): [number, number, number] | undefined {
  const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    const raw = hex[1].length === 3
      ? hex[1].split('').map(char => char + char).join('')
      : hex[1]
    return [
      parseInt(raw.slice(0, 2), 16),
      parseInt(raw.slice(2, 4), 16),
      parseInt(raw.slice(4, 6), 16)
    ]
  }

  const rgb = value.match(/^rgba?\(\s*([0-9.]+)[,\s]+([0-9.]+)[,\s]+([0-9.]+)/i)
  if (!rgb) return

  return [
    Number(rgb[1]),
    Number(rgb[2]),
    Number(rgb[3])
  ]
}

export default observer(UiProvider)
