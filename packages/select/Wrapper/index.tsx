import { useState, type ReactNode } from 'react'
import { Modal, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { css, pug, observer, themed } from 'startupjs'

import Div from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import {
  getOptionEntries,
  getOptionKeyFromValue,
  getValueFromKey,
  PICKER_NULL,
  type SelectOption
} from './helpers'

const OVERLAY_STYLE: any = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
  padding: 0,
  margin: 0,
  zIndex: 10,
  ...(Platform.OS === 'web'
    ? {
        appearance: 'none',
        borderWidth: 0,
        cursor: 'pointer',
        opacity: 0
      }
    : null),
  ...(Platform.OS === 'android'
    ? { opacity: 0 }
    : null)
}

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
  /** Test identifier passed to wrapper root */
  testID?: string
  /** Cross-platform accessible name */
  'aria-label'?: string
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
  /** Web-only required state */
  'aria-required'?: boolean
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
  id,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-errormessage': ariaErrorMessage,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
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
      select(
        id=id
        style=OVERLAY_STYLE
        value=selectedKey
        disabled=disabled
        onChange=onSelectChange
        role='combobox'
        aria-haspopup='listbox'
        aria-label=ariaLabel
        aria-labelledby=ariaLabelledBy
        aria-describedby=ariaDescribedBy
        aria-errormessage=ariaErrorMessage
        aria-invalid=ariaInvalid
        aria-required=ariaRequired
      )
        each entry in optionEntries
          option(
            key=entry.key
            value=entry.key
            aria-selected=entry.key === selectedKey
          )
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
          Div.modalTop(onPress=() => setShowModal(false))
          Div.modalMiddle
            Div(
              onPress=() => setShowModal(false)
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

export default themed('Select', observer(SelectWrapper))

css`
  .root {
    position: relative;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    padding: 0;
    margin: 0;
    z-index: 10;
    opacity: 0;
  }

  .modalTop {
    flex: 1;
  }

  .modalMiddle {
    height: var(--Select-modal-middle-height);
    flex-direction: row;
    align-items: center;
    padding-right: var(--Select-modal-middle-padding-right);
    justify-content: flex-end;
    background-color: var(--Select-modal-middle-bg);
    border-top-width: var(--Select-modal-middle-border-width);
    border-top-color: var(--Select-modal-middle-border-color);
  }

  .modalBottom {
    justify-content: center;
    background-color: var(--Select-modal-bottom-bg);
  }

  .done {
    color: var(--Select-done-color);
    font-family: var(--Select-done-font-family);
    font-weight: var(--Select-done-font-weight);
    font-size: var(--Select-done-font-size);
    line-height: var(--Select-done-line-height);
  }
`
