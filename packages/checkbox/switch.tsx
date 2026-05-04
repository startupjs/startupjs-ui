import { useRef, type ReactNode } from 'react'
import { Animated, Easing } from 'react-native'
import { pug, observer, useDidUpdate } from 'startupjs'
import Div from '@startupjs-ui/div'
import { themed } from '@startupjs-ui/core'
import STYLES from './index.cssx.styl'

const {
  config: {
    switch: {
      circleLeftPosition,
      circleRightPosition
    }
  }
} = STYLES
const AnimatedView = Animated.View

interface SwitchInputProps {
  value?: boolean
  checkedBgColor?: string
  _hasError?: boolean
  [key: string]: any
}

function SwitchInput ({
  value,
  checkedBgColor,
  _hasError,
  style,
  ...props
}: SwitchInputProps): ReactNode {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current

  useDidUpdate(() => {
    if (value) {
      Animated.timing(
        animation,
        {
          toValue: 1,
          duration: 120,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ).start()
    } else {
      Animated.timing(
        animation,
        {
          toValue: 0,
          duration: 120,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ).start()
    }
  }, [value])

  const checkedBgStyle = value && checkedBgColor
    ? { backgroundColor: checkedBgColor }
    : undefined

  return pug`
    Div.switch(
      styleName=[{ checked: value, error: _hasError }]
      style=style
      ...props
    )
      Div.switch-bg(style=checkedBgStyle)
      AnimatedView.switch-circle(
        part='switchCircle'
        style={
          transform: [{
            translateX: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [circleLeftPosition, circleRightPosition]
            })
          }]
        }
        styleName={ checked: value }
      )
  `
}
export default observer(themed('Checkbox', SwitchInput))
