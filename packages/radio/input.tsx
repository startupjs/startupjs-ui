import { type ReactNode, useRef } from 'react'
import { Animated, Easing, Platform, type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, useDidUpdate, themed } from 'startupjs'
import Div from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'

import { parseValue } from './helpers'

const IS_ANDROID = Platform.OS === 'android'
const ANIMATION_TIMING = 100
// workaround for android
// https://github.com/facebook/react-native/issues/6278
const MIN_SCALE_RATIO = IS_ANDROID ? 0.1 : 0
const MAX_SCALE_RATIO = 1

export interface RadioInputProps {
  /** Custom styles for the input wrapper */
  style?: StyleProp<ViewStyle>
  /** JSON-stringified option value */
  value: string
  /** Optional description displayed under the label */
  description?: string
  /** Label content */
  children?: ReactNode
  /** Checked state */
  checked?: boolean
  /** Disable interactions */
  disabled?: boolean
  /** Render as non-interactive */
  readonly?: boolean
  /** Change handler */
  onChange?: (value: any) => void
  /** Error state */
  error?: boolean
}

const RadioInput = function ({
  style,
  value,
  description,
  children,
  checked,
  disabled,
  readonly,
  onChange,
  error
}: RadioInputProps): ReactNode {
  const animation = useRef(
    new Animated.Value(checked ? MAX_SCALE_RATIO : MIN_SCALE_RATIO)
  ).current

  useDidUpdate(() => {
    if (checked) {
      Animated.timing(
        animation,
        {
          toValue: MAX_SCALE_RATIO,
          duration: ANIMATION_TIMING,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ).start()
    } else {
      Animated.timing(
        animation,
        {
          toValue: MIN_SCALE_RATIO,
          duration: ANIMATION_TIMING,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ).start()
    }
  }, [checked])

  return pug`
    Div.input-input(
      part='root'
      style=style
      vAlign='center'
      disabled=disabled || readonly
      onPress=() => onChange && onChange(parseValue(value))
      role='radio'
      aria-checked=!!checked
      aria-disabled=disabled || readonly
      row
    )
      Div.radio(
        part='control'
        styleName=[{ checked, error }]
      )
        Animated.View.circle(
          part='circle'
          style={ transform: [{ scale: animation }] }
          styleName={ error }
        )
      if children
        Div.container(part='content')
          Span.label(part='label')= children
          if description
            Span.description(part='description' description)= description
  `
}

export default observer(themed('Radio', RadioInput))

css`
  .input-input {
    align-self: flex-start;
    padding-top: var(--Radio-input-padding-y);
    padding-bottom: var(--Radio-input-padding-y);
  }

  .radio {
    width: var(--Radio-size);
    height: var(--Radio-size);
    border-color: var(--Radio-border-color);
    border-radius: var(--Radio-radius);
    border-width: var(--Radio-border-width);
    justify-content: center;
    align-items: center;
  }

  .radio.checked {
    border-color: var(--Radio-checked-border-color);
  }

  .radio.error {
    border-color: var(--Radio-error-border-color);
  }

  .circle {
    border-radius: var(--Radio-circle-radius);
    width: var(--Radio-circle-size);
    height: var(--Radio-circle-size);
    background-color: var(--Radio-circle-bg);
  }

  .circle.error {
    background-color: var(--Radio-circle-bg-error);
  }

  .container {
    margin-left: var(--Radio-label-gap);
    flex-shrink: 1;
  }

  .description {
    font-size: var(--Radio-description-font-size);
    line-height: var(--Radio-description-line-height);
    color: var(--Radio-description-color);
  }
`
