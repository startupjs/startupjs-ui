import { type ReactNode } from 'react'
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native'
import { pug, observer, useCssColor, themed } from 'startupjs'

const SIZES = { s: 'small', m: 'large' }
const COLOR_TOKEN_RE = /^[A-Za-z][A-Za-z0-9_-]*$/

function isSemanticColorToken (value: string): boolean {
  return COLOR_TOKEN_RE.test(value.trim())
}

export default themed('Loader', observer(Loader))

export const _PropsJsonSchema = {/* LoaderProps */}

export interface LoaderProps extends Omit<ActivityIndicatorProps, 'size' | 'color' | 'children'> {
  /** Color token or raw color @default 'muted-foreground' */
  color?: string
  /** Component size @default 'm' */
  size?: 's' | 'm'
}

function Loader ({
  color = 'muted-foreground',
  size = 'm',
  ...props
}: LoaderProps): ReactNode {
  const resolvedColor = useCssColor(color)
  const _color = resolvedColor ?? color
  if (!resolvedColor && isSemanticColorToken(color)) console.error(`Loader component: Unknown color token "${color}"`)

  return pug`
    ActivityIndicator(
      part='root'
      color=_color
      size=SIZES[size]
      ...props
    )
  `
}
