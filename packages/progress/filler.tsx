import { useState, type ReactNode } from 'react'
import {
  Animated, Easing, type StyleProp, type ViewStyle
} from 'react-native'
import { css, pug, observer, useCssVariable, useDidUpdate, themed } from 'startupjs'

const AnimatedView = Animated.View

interface ProgressFillerProps {
  style?: StyleProp<ViewStyle>
  value: number
}

function toNumber (value: unknown, fallback: number): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function ProgressFiller ({ style, value }: ProgressFillerProps): ReactNode {
  const [progress] = useState(() => new Animated.Value(value))
  const [width, setWidth] = useState(0)
  const duration = toNumber(useCssVariable('--Progress-duration', 300), 300)

  useDidUpdate(() => {
    Animated.timing(
      progress,
      {
        toValue: value,
        duration,
        easing: Easing.linear,
        useNativeDriver: true
      }
    ).start()
  }, [value])

  return pug`
    AnimatedView.filler(
      style=[
        style,
        {
          transform: [{
            translateX: progress.interpolate({
              inputRange: [0, 100],
              outputRange: [-width, 0]
            })
          }]
        }
      ]
      onLayout=(event) => setWidth(event.nativeEvent.layout.width)
    )
  `
}

export default observer(themed('Progress', ProgressFiller))

css`
  .filler {
    background-color: var(--Progress-filler-bg);
  }
`
