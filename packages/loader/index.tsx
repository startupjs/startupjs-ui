import { type ReactNode } from 'react'
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native'
import { pug, observer, useCssVariable } from 'startupjs'
import { colorVariableRequest, themed } from '@startupjs-ui/core'

const SIZES = { s: 'small', m: 'large' }

export default observer(themed('Loader', Loader))

export const _PropsJsonSchema = {/* LoaderProps */}

export interface LoaderProps extends Omit<ActivityIndicatorProps, 'size' | 'color' | 'children'> {
  /** Color token or raw color @default 'text-description' */
  color?: string
  /** Component size @default 'm' */
  size?: 's' | 'm'
}

function Loader ({
  color = 'text-description',
  size = 'm',
  ...props
}: LoaderProps): ReactNode {
  const colorRequest = colorVariableRequest(color)
  const _color = useCssVariable(colorRequest.name, colorRequest.fallback) as string | undefined
  if (!_color) console.error(`Loader component: Unknown color token "${color}"`)

  return pug`
    ActivityIndicator(
      color=_color
      size=SIZES[size]
      ...props
    )
  `
}
