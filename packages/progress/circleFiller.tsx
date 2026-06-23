import { useState, type ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { pug, observer, useCssVariable, themed } from 'startupjs'

interface CircleFillerProps {
  style?: StyleProp<ViewStyle>
  value?: number
  width?: number
}

function toNumber (value: unknown, fallback: number): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function CircleFiller ({
  style,
  value = 0,
  width = 4
}: CircleFillerProps): ReactNode {
  const [layoutSize, setLayoutSize] = useState(0)
  const defaultDiameter = toNumber(useCssVariable('--Progress-circular-size', 40), 40)
  const trackColor = useCssVariable('--Progress-track-bg', 'var(--color-muted)') as string
  const valueColor = useCssVariable('--Progress-filler-bg', 'var(--color-success)') as string

  const normalizedValue = Math.max(0, Math.min(100, value))
  const diameter = layoutSize > 0 ? layoutSize : defaultDiameter
  const strokeWidth = Math.max(2, Number(width) || 2)
  const radius = (diameter - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - normalizedValue / 100)

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

export default themed('Progress', observer(CircleFiller))
