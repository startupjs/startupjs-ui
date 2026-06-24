import { useRef, type ReactNode } from 'react'
import { Animated, Easing } from 'react-native'
import { css, pug, observer, useDidUpdate, themed } from 'startupjs'
import Div from '@startupjs-ui/div'

const SWITCH_CIRCLE_LEFT_POSITION = 3
const SWITCH_CIRCLE_RIGHT_POSITION = 11
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
  switchCircleStyle,
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
      part='root'
      styleName=[{ checked: value, error: _hasError }]
      style=style
      ...props
    )
      Div.switch-bg(style=checkedBgStyle)
      AnimatedView.switch-circle(
        part='switchCircle'
        style=[switchCircleStyle, {
          transform: [{
            translateX: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [SWITCH_CIRCLE_LEFT_POSITION, SWITCH_CIRCLE_RIGHT_POSITION]
            })
          }]
        }]
        styleName={ checked: value }
      )
  `
}
export default themed('Checkbox', observer(SwitchInput))

css`
  .switch {
    width: var(--Checkbox-switch-width);
    height: var(--Checkbox-switch-height);
    border-radius: var(--Checkbox-switch-radius);
    justify-content: center;
    background-color: var(--Checkbox-switch-bg);
  }

  .switch.error {
    background-color: var(--Checkbox-switch-bg-error);
  }

  .switch.checked {
    background-color: var(--Checkbox-switch-bg-checked);
  }

  .switch-bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: var(--Checkbox-switch-radius);
  }

  .switch-circle {
    width: var(--Checkbox-switch-circle-size);
    height: var(--Checkbox-switch-circle-size);
    background-color: var(--Checkbox-switch-circle-bg);
    border-radius: var(--Checkbox-switch-circle-radius);
    box-shadow: var(--Checkbox-switch-circle-shadow);
  }

  .switch-circle.checked {
    background-color: var(--Checkbox-switch-circle-bg-checked);
  }
`
