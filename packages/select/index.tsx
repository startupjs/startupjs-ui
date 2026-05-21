import { type ReactNode, type RefObject } from 'react'
import { pug, observer } from 'startupjs'
import TextInput, { type UITextInputProps } from '@startupjs-ui/text-input'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import Wrapper from './Wrapper'
import { getLabelFromValue, type SelectOption } from './Wrapper/helpers'

export default observer(Select)

export const _PropsJsonSchema = {/* SelectProps */} // used in docs generation

export interface SelectProps extends Omit<UITextInputProps, 'value' | 'onChangeText' | 'icon' | 'iconPosition' | '_renderWrapper' | 'editable'> {
  /** Available options (strings, numbers, or objects with `{ value, label }`) @default [] */
  options?: SelectOption[]
  /** Current selected value */
  value?: any
  /** Show empty/none option @default true */
  showEmptyValue?: boolean
  /** Label for the empty/none option */
  emptyValueLabel?: string | number
  /** Ref forwarded to underlying TextInput */
  ref?: RefObject<any>
  /** Test identifier passed to wrapper; on web the native `<select>` overlay also receives `data-testid="{testID}-combobox"` when set */
  testID?: string
  /** Cross-platform accessible name */
  'aria-label'?: string
  /** Accessible label forwarded to the web select overlay */
  accessibilityLabel?: string
  /** Accessible hint forwarded to the web select overlay */
  accessibilityHint?: string
  /** Web-only control id forwarded to the native select overlay */
  id?: string
  /** Native id alias forwarded to the native select overlay */
  nativeID?: string
  /** Web-only labelled-by relationship */
  'aria-labelledby'?: string
  /** Web-only described-by relationship */
  'aria-describedby'?: string
  /** Web-only error message relationship */
  'aria-errormessage'?: string
  /** Web-only invalid state */
  'aria-invalid'?: boolean
  /** Fired when selected value changes */
  onChange?: (value: any) => void
}

function Select ({
  options = [],
  value,
  disabled = false,
  showEmptyValue = true,
  emptyValueLabel,
  testID,
  'aria-label': ariaLabel,
  accessibilityLabel,
  accessibilityHint,
  id,
  nativeID,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-errormessage': ariaErrorMessage,
  'aria-invalid': ariaInvalid,
  onChange,
  ref,
  ...props
}: SelectProps): ReactNode {
  function renderWrapper (
    { style }: { style?: any },
    children: ReactNode
  ): ReactNode {
    return pug`
      Wrapper(
        style=style
        options=options
        disabled=disabled
        value=value
        onChange=onChange
        showEmptyValue=showEmptyValue
        emptyValueLabel=emptyValueLabel
        testID=testID
        aria-label=ariaLabel ?? accessibilityLabel
        id=id || nativeID
        aria-labelledby=ariaLabelledBy
        aria-describedby=ariaDescribedBy
        aria-errormessage=ariaErrorMessage
        aria-invalid=ariaInvalid
      )= children
    `
  }

  return pug`
    //- TODO
    //- Add onKeyPress to 'keyDown' key that opens select dropdown
    TextInput(
      ref=ref
      value=getLabelFromValue(value, options, emptyValueLabel)
      disabled=disabled
      icon=faAngleDown
      iconPosition='right'
      _renderWrapper=renderWrapper
      editable=false /* HACK: Fixes cursor visibility when focusing on Select because we're focusing on TextInput */
      ...props
    )
  `
}
