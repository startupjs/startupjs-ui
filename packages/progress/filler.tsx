import { useState, type ReactNode } from 'react'
import {
  Animated,
  Easing,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { pug, observer, useDidUpdate } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import STYLES from './index.cssx.styl'

const {
  config: {
    duration
  }
} = STYLES

const AnimatedView = Animated.View

interface ProgressFillerProps {
  style?: StyleProp<ViewStyle>
  value: number
}

function ProgressFiller ({ style, value }: ProgressFillerProps): ReactNode {
  const [progress] = useState(() => new Animated.Value(value))
  const [width, setWidth] = useState(0)

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
