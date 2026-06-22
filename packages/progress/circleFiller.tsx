import { useState, type ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { pug, observer, u, useCssVariable, themed } from 'startupjs'

import STYLE from './index.cssx.styl'

const { config: { filler: { backgroundColor, color } } } = STYLE

interface CircleFillerProps {
  style?: StyleProp<ViewStyle>
  value?: number
  width?: number
}

function getCssVarName (value: string) {
  const match = String(value || '').match(/^var\((--[^)]+)\)$/)
  return match?.[1]
}

function CircleFiller ({
  style,
  value = 0,
  width = u(0.5)
}: CircleFillerProps): ReactNode {
  const [layoutSize, setLayoutSize] = useState(0)
  const trackColorVar = getCssVarName(backgroundColor)
  const valueColorVar = getCssVarName(color)
  const resolvedTrackColor = useCssVariable(trackColorVar ?? '--__startupjs-ui-unused-color') as string | undefined
  const resolvedValueColor = useCssVariable(valueColorVar ?? '--__startupjs-ui-unused-color') as string | undefined

  const normalizedValue = Math.max(0, Math.min(100, value))
  const diameter = layoutSize > 0 ? layoutSize : u(5)
  const strokeWidth = Math.max(2, Number(width) || 2)
  const radius = (diameter - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - normalizedValue / 100)

  const trackColor = resolvedTrackColor ?? backgroundColor
  const valueColor = resolvedValueColor ?? color

  return pug`
    View(
      style=[style]
      onLayout=(event) => {
        const { width, height } = event.nativeEvent.layout || {}
        const nextSize = Math.min(width || 0, height || 0)
        if (nextSize > 0 && nextSize !== layoutSize) setLayoutSize(nextSize)
      }
    )
      Svg(width=diameter height=diameter)
        Circle(
          cx=diameter / 2
          cy=diameter / 2
          r=radius
          stroke=trackColor
          strokeWidth=strokeWidth
          fill='none'
        )
        Circle(
          cx=diameter / 2
          cy=diameter / 2
          r=radius
          stroke=valueColor
          strokeWidth=strokeWidth
          fill='none'
          strokeLinecap='round'
          strokeDasharray=[circumference, circumference]
          strokeDashoffset=strokeDashoffset
          rotation='-90'
          origin=(diameter / 2) + ', ' + (diameter / 2)
        )
  `
}

export default observer(themed('Progress', CircleFiller))
