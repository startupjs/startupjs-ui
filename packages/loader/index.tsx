import { type ReactNode } from 'react'
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native'
import { pug, observer } from 'startupjs'
import { Colors, themed, useColors } from '@startupjs-ui/core'

const SIZES = { s: 'small', m: 'large' }

export default observer(themed('Loader', Loader))

export const _PropsJsonSchema = {/* LoaderProps */}

export interface LoaderProps extends Omit<ActivityIndicatorProps, 'size' | 'color' | 'children'> {
  /** Color token defined in Colors @default 'text-description' */
  color?: string
  /** Component size @default 'm' */
  size?: 's' | 'm'
}

function Loader ({
  color = Colors['text-description'],
  size = 'm',
  ...props
}: LoaderProps): ReactNode {
  const getColor = useColors()
  const _color = getColor(color)
  if (!_color) console.error('Loader component: Color for color property is incorrect. Use colors from Colors')

  return pug`
    ActivityIndicator(
      color=_color
      size=SIZES[size]
      ...props
    )
  `
}
