import { useRef, useImperativeHandle, type ReactNode, type RefObject } from 'react'
import { pug, observer } from 'startupjs'
import guessInput from './helpers/guessInput'
import getInputTestId from './helpers/getInputTestId'
import { useInputMeta } from './inputs'
import type { InputWrapperConfiguration } from './wrapInput'

export const _PropsJsonSchema = {/* InputProps */}

export interface InputProps {
  /** Explicit input type override (ignores schema guessing) */
  input?: 'array' | 'checkbox' | 'color' | 'date' | 'datetime' | 'time' | 'multiselect' | 'number' | 'object' | 'password' | 'file' | 'rank' | 'radio' | 'range' | 'select' | 'text'
  /** Schema or input type @default 'text' */
  type?: 'array' | 'checkbox' | 'color' | 'date' | 'datetime' | 'time' | 'multiselect' | 'number' | 'object' | 'password' | 'file' | 'rank' | 'radio' | 'range' | 'select' | 'text' | 'string' | 'boolean' | 'integer'
  /** Input value */
  value?: any
  /** Two-way binding for value */
  $value?: any
  /** Label text */
  label?: string
  /** Description text */
  description?: string
  /** Layout for label and description @default 'rows' when label/description is present */
  layout?: 'pure' | 'rows' | 'columns'
  /** Configuration overrides for the wrapper */
  configuration?: InputWrapperConfiguration
  /** Error message or list of messages */
  error?: string | string[]
  /** Required flag or json-schema required object */
  required?: boolean | object
  /** Disable interactions */
  disabled?: boolean
  /** Render as read-only */
  readonly?: boolean
  /** Test id for generated testID */
  testId?: string
  /** Placeholder text */
  placeholder?: string
  /** Options for select-like inputs */
  options?: any
  /** Schema enum for select-like inputs */
  enum?: any[]
  /** Schema items for array inputs */
  items?: any
  /** Schema properties for object inputs */
  properties?: Record<string, any>
  /** Value change handler (checkbox/select/range/etc.) */
  onChange?: (...args: any[]) => void
  /** Text change handler */
  onChangeText?: (...args: any[]) => void
  /** Number change handler */
  onChangeNumber?: (...args: any[]) => void
  /** Date/time change handler */
  onChangeDate?: (...args: any[]) => void
  /** Color change handler */
  onChangeColor?: (...args: any[]) => void
  /** Focus handler */
  onFocus?: (...args: any[]) => void
  /** Blur handler */
  onBlur?: (...args: any[]) => void
  /** Imperative ref to the rendered input */
  ref?: RefObject<any>
  /** Additional props passed to the underlying input */
  [key: string]: any
}

function Input ({
  input,
  type = 'text',
  ref,
  ...props
}: InputProps): ReactNode {
  const inputType = guessInput(input, type, props)

  const testID = getInputTestId(props)
  const { Component, useProps } = useInputMeta(inputType)

  if (!Component) {
    throw Error(`
      Input component for '${inputType}' not found.
      Make sure you have passed it to 'customInputs' in your Form
      or connected it as a plugin in the 'customFormInputs' hook.
    `)
  }

  // ref: https://stackoverflow.com/a/68163315 (why innerRef is needed here)
  const innerRef = useRef<any>(null)

  const componentProps = useProps({ ...props, testID }, innerRef)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useImperativeHandle(ref, () => innerRef.current, [Component])

  return pug`
    Component(
      ref=innerRef
      ...componentProps
    )
  `
}

export default observer(Input)

export { default as wrapInput, isWrapped, IS_WRAPPED } from './wrapInput'
export { default as guessInput } from './helpers/guessInput'
export { setCustomInputs, customInputs } from './globalCustomInputs'
export { useInputMeta } from './inputs'
export { default as useCustomInputs, CustomInputsContext } from './useCustomInputs'
