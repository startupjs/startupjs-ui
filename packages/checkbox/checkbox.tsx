import { useState, useRef, type ReactNode } from 'react'
import { Animated, Easing } from 'react-native'
import { pug, observer, useDidUpdate } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import STYLES from './index.cssx.styl'

const { config: { checkbox: { iconSize } } } = STYLES
const AnimatedView = Animated.View

interface CheckboxInputProps {
  value?: boolean
  icon?: any
  _hasError?: boolean
  [key: string]: any
}

function CheckboxInput ({
  value,
  icon,
  _hasError,
  ...props
}: CheckboxInputProps): ReactNode {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current
  const [width, setWidth] = useState(0)
  const [animated, setAnimated] = useState(false)

  useDidUpdate(() => {
    if (value) {
      setAnimated(true)
      Animated.timing(
        animation,
        {
          toValue: 1,
          duration: 120,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ).start(() => {
        setAnimated(false)
      })
    } else {
      animation.setValue(0)
    }
  }, [value])

  const checkedStyleName = { checked: value }

  return pug`
    Div.checkbox(
      styleName=[checkedStyleName, { error: _hasError }]
      role='checkbox'
      onLayout=(event) => setWidth(event.nativeEvent.layout.width)
      ...props
    )
      Icon.checkbox-icon(
        styleName=[checkedStyleName]
        icon= icon || faCheck
        size=iconSize
      )
      AnimatedView.checkbox-animation(
        styleName=[{ animated }]
        style={
          transform: [{
            translateX: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, width]
            })
          }]
        }
      )
  `
}

export default observer(themed('Checkbox', CheckboxInput))
