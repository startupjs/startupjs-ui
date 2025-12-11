import {
  useState,
  type ReactNode,
  type RefObject
} from 'react'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import TextInput, { type UITextInputProps } from '@startupjs-ui/text-input'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'

export const _PropsJsonSchema = {/* PasswordInputProps */}

export interface PasswordInputProps extends UITextInputProps {
  /** Ref to access the underlying TextInput */
  ref?: RefObject<any>
  /** Custom styles for the wrapper element */
  style?: UITextInputProps['style']
  /** Custom styles for the input element */
  inputStyle?: UITextInputProps['inputStyle']
  /** Placeholder text */
  placeholder?: UITextInputProps['placeholder']
  /** Input value @default '' */
  value?: string
  /** Size preset @default 'm' */
  size?: 'l' | 'm' | 's'
  /** Disable input interactions @default false */
  disabled?: boolean
  /** Focus event handler */
  onFocus?: UITextInputProps['onFocus']
  /** Blur event handler */
  onBlur?: UITextInputProps['onBlur']
  /** Change text handler */
  onChangeText?: UITextInputProps['onChangeText']
  /** Error flag @private */
  _hasError?: boolean
}

function PasswordInput ({
  value = '',
  size = 'm',
  disabled = false,
  ref,
  ...props
}: PasswordInputProps): ReactNode {
  const [textHidden, setTextHidden] = useState(true)

  return pug`
    TextInput(
      ...props
      ref=ref
      autoComplete='password'
      secureTextEntry=textHidden
      icon=textHidden ? faEye : faEyeSlash
      iconPosition='right'
      numberOfLines=1
      resize=false
      readonly=false
      value=value
      size=size
      disabled=disabled
      onIconPress=() => setTextHidden(!textHidden)
    )
  `
}

export default observer(themed('PasswordInput', PasswordInput))
