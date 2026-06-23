import { useState, useRef, type ReactNode } from 'react'
import { Animated, Easing } from 'react-native'
import { css, pug, observer, useDidUpdate, themed } from 'startupjs'

import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'

const CHECKBOX_ICON_SIZE = 12
const AnimatedView = Animated.View

interface CheckboxInputProps {
  value?: boolean
  icon?: any
  iconStyle?: any
  checkedBgColor?: string
  _hasError?: boolean
  [key: string]: any
}

function CheckboxInput ({
  value,
  icon,
  iconStyle,
  checkedBgColor,
  _hasError,
  style,
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
  const checkedBgStyle = value && checkedBgColor
    ? { backgroundColor: checkedBgColor }
    : undefined

  return pug`
    Div.checkbox(
      part='root'
      styleName=[checkedStyleName, { error: _hasError }]
      role='checkbox'
      style=style
      onLayout=(event) => setWidth(event.nativeEvent.layout.width)
      ...props
    )
      Div.checkbox-bg(style=checkedBgStyle)
      Icon.checkbox-icon(
        part='icon'
        style=iconStyle
        styleName=[checkedStyleName]
        icon= icon || faCheck
        size=CHECKBOX_ICON_SIZE
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

export default themed('Checkbox', observer(CheckboxInput))

css`
  .checkbox {
    height: var(--Checkbox-size);
    width: var(--Checkbox-size);
    border-width: var(--Checkbox-border-width);
    border-color: var(--Checkbox-border-color);
    justify-content: center;
    align-items: center;
    border-radius: var(--Checkbox-radius);
    overflow: hidden;
  }

  .checkbox.error {
    border-color: var(--Checkbox-error-border-color);
  }

  .checkbox.checked {
    background-color: var(--Checkbox-checked-bg);
    border-color: var(--Checkbox-checked-border-color);
  }

  .checkbox-bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: var(--Checkbox-radius);
  }

  .checkbox-icon {
    display: none;
    color: var(--Checkbox-checked-icon-color);
  }

  .checkbox-icon.checked {
    display: flex;
  }

  .checkbox-animation {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: var(--Checkbox-checked-bg);
  }

  .checkbox-animation.animated {
    opacity: 1;
  }
`
