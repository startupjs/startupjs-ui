import { useState, type ReactNode } from 'react'
import { Modal, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import {
  getOptionEntries,
  getOptionKeyFromValue,
  getValueFromKey,
  PICKER_NULL,
  type SelectOption
} from './helpers'
import STYLES from './index.cssx.styl'

export interface SelectWrapperProps {
  /** Custom styles for wrapper */
  style?: any
  /** Input element rendered inside wrapper */
  children?: ReactNode
  /** Available options @default [] */
  options?: SelectOption[]
  /** Current selected value */
  value?: any
  /** Disable interactions */
  disabled?: boolean
  /** Show empty/none option */
  showEmptyValue?: boolean
  /** Label for empty/none option */
  emptyValueLabel?: string | number
  /** Test identifier */
  testID?: string
  /** Cross-platform accessible name */
  'aria-label'?: string
  /** Accessible label for the web select overlay */
  accessibilityLabel?: string
  /** Accessible hint for the web select overlay */
  accessibilityHint?: string
  /** Web-only control id for label association */
  id?: string
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

function SelectWrapper (props: SelectWrapperProps): ReactNode {
  if (Platform.OS === 'web') return pug`SelectWrapperWeb(...props)`
  if (Platform.OS === 'ios') return pug`SelectWrapperIOS(...props)`
  return pug`SelectWrapperAndroid(...props)`
}

function SelectWrapperWeb ({
  style,
  children,
  options = [],
  value,
  disabled,
  showEmptyValue,
  emptyValueLabel,
  testID,
  'aria-label': ariaLabel,
  accessibilityLabel,
  accessibilityHint,
  id,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-errormessage': ariaErrorMessage,
  'aria-invalid': ariaInvalid,
  onChange
}: SelectWrapperProps): ReactNode {
  const optionEntries = getOptionEntries(options, showEmptyValue, emptyValueLabel)
  const selectedKey = getOptionKeyFromValue(value, options, showEmptyValue, emptyValueLabel) ?? PICKER_NULL

  function onSelectChange (event: any) {
    if (onChange) onChange(getValueFromKey(event.target.value, options, showEmptyValue, emptyValueLabel))
  }

  return pug`
    Div.root(style=style testID=testID)
      = children
      if !disabled
        select(
          id=id
          style=STYLES.overlay
          value=selectedKey
          onChange=onSelectChange
          aria-label=ariaLabel ?? accessibilityLabel
          aria-labelledby=ariaLabelledBy
          aria-describedby=ariaDescribedBy
          aria-errormessage=ariaErrorMessage
          aria-invalid=ariaInvalid
        )
          each entry in optionEntries
            option(key=entry.key value=entry.key)
              = entry.label
  `
}

function SelectWrapperAndroid ({
  style,
  children,
  options = [],
  value,
  disabled,
  showEmptyValue,
  emptyValueLabel,
  onChange
}: SelectWrapperProps): ReactNode {
  const optionEntries = getOptionEntries(options, showEmptyValue, emptyValueLabel)
  const selectedKey = getOptionKeyFromValue(value, options, showEmptyValue, emptyValueLabel) ?? PICKER_NULL

  function onValueChange (value: any) {
    if (onChange) onChange(getValueFromKey(value, options, showEmptyValue, emptyValueLabel))
  }

  return pug`
    Div.root(style=style)
      = children
      if !disabled
        Picker.overlay(
          selectedValue=selectedKey
          onValueChange=onValueChange
        )
          each entry in optionEntries
            Picker.Item(
              key=entry.key
              value=entry.key
              label=entry.label
            )
  `
}

function SelectWrapperIOS ({
  style,
  children,
  options = [],
  value,
  disabled,
  showEmptyValue,
  emptyValueLabel,
  onChange
}: SelectWrapperProps): ReactNode {
  const [showModal, setShowModal] = useState(false)
  const optionEntries = getOptionEntries(options, showEmptyValue, emptyValueLabel)
  const selectedKey = getOptionKeyFromValue(value, options, showEmptyValue, emptyValueLabel) ?? PICKER_NULL

  function onValueChange (value: any) {
    if (onChange) onChange(getValueFromKey(value, options, showEmptyValue, emptyValueLabel))
  }

  return pug`
    Div.root(style=style)
      = children
      if !disabled
        Div.overlay(
          activeOpacity=1
          onPress=() => setShowModal(true)
        )
        Modal(
          visible=showModal
          transparent
          animationType='slide'
        )
          Div.modalTop(onPress=()=> setShowModal(false))
          Div.modalMiddle
            Div(
              onPress=()=> setShowModal(false)
              hitSlop={ top: 4, right: 4, bottom: 4, left: 4 }
            )
              Span.done Done
          Div.modalBottom
            Picker(
              selectedValue=selectedKey
              onValueChange=onValueChange
            )
              each entry in optionEntries
                Picker.Item(
                  key=entry.key
                  value=entry.key
                  label=entry.label
                )
  `
}

export default observer(themed('Select', SelectWrapper))
