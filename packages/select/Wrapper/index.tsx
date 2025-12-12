import { useState, type ReactNode } from 'react'
import { Modal, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import {
  stringifyValue,
  getLabel,
  parseValue,
  NULL_OPTION,
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
  onChange
}: SelectWrapperProps): ReactNode {
  function onSelectChange (event: any) {
    const value = event.target.value
    if (onChange) onChange(parseValue(value))
  }

  return pug`
    Div.root(style=style testID=testID)
      = children
      if !disabled
        select(
          style=STYLES.overlay
          value=stringifyValue(value)
          onChange=onSelectChange
        )
          if showEmptyValue
            option(key=-1 value=stringifyValue(NULL_OPTION))
              = emptyValueLabel || getLabel(NULL_OPTION)
          each item, index in options
            option(key=index value=stringifyValue(item))
              = getLabel(item)
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
  function onValueChange (value: any) {
    if (onChange) onChange(parseValue(value))
  }

  return pug`
    Div.root(style=style)
      = children
      if !disabled
        Picker.overlay(
          selectedValue=stringifyValue(value)
          onValueChange=onValueChange
        )
          if showEmptyValue
            Picker.Item(
              key=-1
              value=stringifyValue(NULL_OPTION)
              label=emptyValueLabel || getLabel(NULL_OPTION)
            )
          each item, index in options
            Picker.Item(
              key=index
              value=stringifyValue(item)
              label=getLabel(item)
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

  function onValueChange (value: any) {
    if (onChange) onChange(parseValue(value))
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
              selectedValue=stringifyValue(value)
              onValueChange=onValueChange
            )
              if showEmptyValue
                Picker.Item(
                  key=-1
                  value=stringifyValue(NULL_OPTION)
                  label=emptyValueLabel || getLabel(NULL_OPTION)
                )
              each item, index in options
                Picker.Item(
                  key=index
                  value=stringifyValue(item)
                  label=getLabel(item)
                )
  `
}

export default observer(themed('Select', SelectWrapper))
