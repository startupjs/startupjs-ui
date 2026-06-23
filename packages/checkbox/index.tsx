import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Div from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import CheckboxInput from './checkbox'
import SwitchInput from './switch'

const INPUT_COMPONENTS = {
  checkbox: CheckboxInput,
  switch: SwitchInput
} as const

const READONLY_ICONS = {
  TRUE: '✓',
  FALSE: '✗'
}

export const _PropsJsonSchema = {/* CheckboxProps */}

export interface CheckboxProps {
  /** Custom styles for the wrapper */
  style?: StyleProp<ViewStyle>
  /** Custom styles for the input element */
  inputStyle?: StyleProp<ViewStyle>
  /** Visual variant @default 'checkbox' */
  variant?: 'checkbox' | 'switch'
  /** Checked state @default false */
  value?: boolean
  /** Custom icon for the checkbox variant */
  icon?: any
  /** Custom styles for the checkbox icon */
  iconStyle?: any
  /** Custom background color when checked */
  checkedBgColor?: string
  /** Disable interactions @default false */
  disabled?: boolean
  /** Render a non-interactive value @default false */
  readonly?: boolean
  /** Change handler */
  onChange?: (value: boolean) => void
  /** Focus handler (ignored on wrapper) */
  onFocus?: (...args: any[]) => void
  /** Blur handler (ignored on wrapper) */
  onBlur?: (...args: any[]) => void
  /** Style override for the switch thumb */
  switchCircleStyle?: StyleProp<ViewStyle>
  /** Error flag @private */
  _hasError?: boolean
  [key: string]: any
}

function Checkbox ({
  style,
  inputStyle,
  variant = 'checkbox',
  readonly = false,
  value = false,
  disabled = false,
  checkedBgColor,
  onChange,
  onFocus, // skip due to pointless triggering when clicked on the View
  onBlur, // skip due to pointless triggering when clicked on the View
  ...props
}: CheckboxProps): ReactNode {
  const InputComponent = INPUT_COMPONENTS[variant]

  function onPress () {
    onChange && onChange(!value)
  }

  return pug`
    Div(part='root' style=style)
      if readonly
        Span.readonly(part='readonly')= value ? READONLY_ICONS.TRUE : READONLY_ICONS.FALSE
      else
        InputComponent(
          part='input'
          style=inputStyle
          value=value
          onPress=onPress
          disabled=disabled
          role=variant === 'switch' ? 'switch' : 'checkbox'
          aria-checked=value
          aria-disabled=disabled
          checkedBgColor=checkedBgColor
          ...props
        )
  `
}

export default observer(
  themed('Checkbox', Checkbox)
)

css`
  .readonly {
    font-weight: var(--Checkbox-readonly-font-weight);
    font-size: var(--Checkbox-readonly-font-size);
    line-height: var(--Checkbox-readonly-line-height);
  }
`
