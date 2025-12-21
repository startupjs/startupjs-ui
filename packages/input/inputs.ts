import { type ReactNode, type RefObject } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, useBind } from 'startupjs'
import ArrayInput from '@startupjs-ui/array-input'
import Card from '@startupjs-ui/card'
import Checkbox from '@startupjs-ui/checkbox'
import ColorPicker from '@startupjs-ui/color-picker'
import FileInput from '@startupjs-ui/file-input'
import DateTimePicker from '@startupjs-ui/date-time-picker'
import Multiselect from '@startupjs-ui/multi-select'
import NumberInput from '@startupjs-ui/number-input'
import PasswordInput from '@startupjs-ui/password-input'
import Rank from '@startupjs-ui/rank'
import Radio from '@startupjs-ui/radio'
import RangeInput from '@startupjs-ui/range-input'
import Select from '@startupjs-ui/select'
import TextInput from '@startupjs-ui/text-input'
import wrapInput, { isWrapped } from './wrapInput'
// TODO: replace with real import once ObjectInput is refactored.
// import ObjectInput from '@startupjs-ui/object-input'
import ObjectInput from './ObjectInput.mock'
import useCustomInputs from './useCustomInputs'
import { customInputs } from './globalCustomInputs'

export type InputUseProps = (
  props: Record<string, any>,
  ref?: RefObject<any>
) => Record<string, any>

export interface InputComponentMeta {
  Component: any
  useProps?: InputUseProps
}

function useBoundProps<T extends Record<string, any>> (props: T): T {
  return useBind(props) as T
}

const useArrayProps = (props: Record<string, any>): Record<string, any> => {
  return props
}

const useCheckboxProps = ({ value, $value, onChange, ...props }: Record<string, any>): Record<string, any> => {
  ;({ value, onChange } = useBoundProps({ value, $value, onChange }))

  return {
    value,
    configuration: { isLabelClickable: !props.disabled && !props.readonly },
    onChange,
    _onLabelPress: () => { onChange(!value) },
    ...props
  }
}

const useColorProps = ({
  value,
  $value,
  onChangeColor,
  ...props
}: Record<string, any>, ref?: RefObject<any>): Record<string, any> => {
  ;({ value, onChangeColor } = useBoundProps({ value, $value, onChangeColor }))

  return {
    value,
    configuration: { isLabelClickable: !props.disabled },
    onChangeColor,
    _onLabelPress: () => { ref?.current?.show() },
    ...props
  }
}

const useDateProps = ({
  value,
  $value,
  onChangeDate,
  ...props
}: Record<string, any>, ref?: RefObject<any>): Record<string, any> => {
  ;({ value, onChangeDate } = useBoundProps({ value, $value, onChangeDate }))

  return {
    mode: 'date',
    date: value,
    configuration: { isLabelClickable: !props.disabled && !props.readonly },
    onChangeDate,
    _onLabelPress: () => ref?.current?.focus(),
    ...props
  }
}

const useDateTimeProps = ({
  value,
  $value,
  onChangeDate,
  ...props
}: Record<string, any>, ref?: RefObject<any>): Record<string, any> => {
  ;({ value, onChangeDate } = useBoundProps({ value, $value, onChangeDate }))

  return {
    mode: 'datetime',
    date: value,
    configuration: { isLabelClickable: !props.disabled && !props.readonly },
    onChangeDate,
    _onLabelPress: () => ref?.current?.focus(),
    ...props
  }
}

const useTimeProps = ({
  value,
  $value,
  onChangeDate,
  ...props
}: Record<string, any>, ref?: RefObject<any>): Record<string, any> => {
  ;({ value, onChangeDate } = useBoundProps({ value, $value, onChangeDate }))

  return {
    mode: 'time',
    date: value,
    configuration: { isLabelClickable: !props.disabled && !props.readonly },
    onChangeDate,
    _onLabelPress: () => ref?.current?.focus(),
    ...props
  }
}

const useMultiselectProps = ({
  value,
  $value,
  onChange,
  ...props
}: Record<string, any>, ref?: RefObject<any>): Record<string, any> => {
  ;({ value, onChange } = useBoundProps({ value, $value, onChange }))

  return {
    value,
    configuration: { isLabelClickable: !props.disabled && !props.readonly },
    onChange,
    _onLabelPress: () => ref?.current?.focus(),
    ...props
  }
}

const useNumberProps = ({
  value,
  $value,
  onChangeNumber,
  ...props
}: Record<string, any>, ref?: RefObject<any>): Record<string, any> => {
  ;({ value, onChangeNumber } = useBoundProps({ value, $value, onChangeNumber }))

  return {
    value,
    configuration: { isLabelClickable: !props.disabled && !props.readonly },
    onChangeNumber,
    _onLabelPress: () => ref?.current?.focus(),
    ...props
  }
}

const useObjectProps = (props: Record<string, any>): Record<string, any> => {
  return props
}

const usePasswordProps = ({
  value,
  $value,
  onChangeText,
  ...props
}: Record<string, any>, ref?: RefObject<any>): Record<string, any> => {
  ;({ value, onChangeText } = useBoundProps({ value, $value, onChangeText }))

  return {
    value,
    configuration: { isLabelClickable: !props.disabled && !props.readonly },
    onChangeText,
    _onLabelPress: () => ref?.current?.focus(),
    ...props
  }
}

const useFileProps = ({ value, $value, onChange, ...props }: Record<string, any>): Record<string, any> => {
  ;({ value, onChange } = useBoundProps({ value, $value, onChange }))
  return {
    value,
    onChange,
    ...props
  }
}

const useRankProps = ({ value, $value, onChange, ...props }: Record<string, any>): Record<string, any> => {
  ;({ value, onChange } = useBoundProps({ value, $value, onChange }))

  return {
    value,
    onChange,
    ...props
  }
}

const useRadioProps = ({ value, $value, onChange, ...props }: Record<string, any>): Record<string, any> => {
  ;({ value, onChange } = useBoundProps({ value, $value, onChange }))

  return {
    value,
    onChange,
    ...props
  }
}

const useRangeProps = ({ value, $value, onChange, ...props }: Record<string, any>): Record<string, any> => {
  ;({ value, onChange } = useBoundProps({ value, $value, onChange }))

  return {
    value,
    onChange,
    ...props
  }
}

const useSelectProps = ({ value, $value, enum: _enum, options, onChange, ...props }: Record<string, any>): Record<string, any> => {
  ;({ value, onChange } = useBoundProps({ value, $value, onChange }))
  // if json-schema `enum` is passed, use it as options
  if (!options && _enum) options = _enum
  return {
    value,
    onChange,
    options,
    ...props
  }
}

const useTextProps = ({
  value,
  $value,
  onChangeText,
  ...props
}: Record<string, any>, ref?: RefObject<any>): Record<string, any> => {
  ;({ value, onChangeText } = useBoundProps({ value, $value, onChangeText }))
  return {
    value,
    configuration: { isLabelClickable: !props.disabled && !props.readonly },
    onChangeText,
    _onLabelPress: () => ref?.current?.focus(),
    ...props
  }
}

function cardWrapper (style: StyleProp<ViewStyle> | undefined, children: ReactNode): ReactNode {
  return pug`
    Card(
      style=style
      variant='outlined'
    )
      = children
  `
}

// NOTE: lazy initialization is needed to prevent circular dependencies
//       with 'wrapInput': ArrayInput and ObjectInput depend on Input (this file)
let _defaultInputs: Record<string, InputComponentMeta>
function getDefaultInputs () {
  if (_defaultInputs) return _defaultInputs
  const WrappedArrayInput = wrapInput(
    ArrayInput,
    {
      rows: { _renderWrapper: cardWrapper },
      columns: { _renderWrapper: cardWrapper }
    }
  )
  const WrappedCheckbox = wrapInput(
    Checkbox,
    {
      rows: {
        labelPosition: 'right',
        descriptionPosition: 'bottom'
      }
    }
  )
  const WrappedColorPicker = wrapInput(
    ColorPicker,
    { rows: { descriptionPosition: 'bottom' } }
  )
  const WrappedDateTimePicker = wrapInput(
    DateTimePicker,
    {
      rows: { descriptionPosition: 'bottom' },
      isLabelColoredWhenFocusing: true
    }
  )
  const WrappedMultiselect = wrapInput(
    Multiselect,
    {
      isLabelColoredWhenFocusing: true
    }
  )
  const WrappedNumberInput = wrapInput(
    NumberInput,
    {
      rows: {
        descriptionPosition: 'bottom'
      },
      isLabelColoredWhenFocusing: true
    }
  )
  const WrappedObjectInput = wrapInput(
    ObjectInput,
    {
      rows: { _renderWrapper: cardWrapper },
      columns: { _renderWrapper: cardWrapper }
    }
  )

  const WrappedPasswordInput = wrapInput(
    PasswordInput,
    {
      rows: {
        descriptionPosition: 'bottom'
      },
      isLabelColoredWhenFocusing: true
    }
  )
  const WrappedFileInput = wrapInput(FileInput)
  const WrappedRank = wrapInput(Rank)
  const WrappedRadio = wrapInput(Radio)
  const WrappedSelect = wrapInput(
    Select,
    {
      rows: {
        descriptionPosition: 'bottom'
      },
      isLabelColoredWhenFocusing: true
    }
  )
  const WrappedTextInput = wrapInput(
    TextInput,
    {
      rows: {
        descriptionPosition: 'bottom'
      },
      isLabelColoredWhenFocusing: true
    }
  )
  const WrappedRange = wrapInput(RangeInput)

  _defaultInputs = {
    array: {
      Component: WrappedArrayInput,
      useProps: useArrayProps
    },
    checkbox: {
      Component: WrappedCheckbox,
      useProps: useCheckboxProps
    },
    color: {
      Component: WrappedColorPicker,
      useProps: useColorProps
    },
    date: {
      Component: WrappedDateTimePicker,
      useProps: useDateProps
    },
    datetime: {
      Component: WrappedDateTimePicker,
      useProps: useDateTimeProps
    },
    time: {
      Component: WrappedDateTimePicker,
      useProps: useTimeProps
    },
    multiselect: {
      Component: WrappedMultiselect,
      useProps: useMultiselectProps
    },
    number: {
      Component: WrappedNumberInput,
      useProps: useNumberProps
    },
    object: {
      Component: WrappedObjectInput,
      useProps: useObjectProps
    },
    password: {
      Component: WrappedPasswordInput,
      useProps: usePasswordProps
    },
    file: {
      Component: WrappedFileInput,
      useProps: useFileProps
    },
    rank: {
      Component: WrappedRank,
      useProps: useRankProps
    },
    radio: {
      Component: WrappedRadio,
      useProps: useRadioProps
    },
    range: {
      Component: WrappedRange,
      useProps: useRangeProps
    },
    select: {
      Component: WrappedSelect,
      useProps: useSelectProps
    },
    text: {
      Component: WrappedTextInput,
      useProps: useTextProps
    }
  }
}

export function useInputMeta (input: string): { Component: any, useProps: InputUseProps } {
  const customInputsFromContext = useCustomInputs()
  const componentMeta = customInputsFromContext[input] || customInputs[input] || getDefaultInputs()?.[input]
  if (!componentMeta) throw Error(ERRORS.inputNotFound(input))
  let Component
  let useProps: InputUseProps | undefined
  if (componentMeta.Component) {
    ;({ Component, useProps } = componentMeta)
  } else {
    Component = componentMeta
  }
  if (!isWrapped(Component)) {
    if (!autoWrappedInputs.has(Component)) {
      autoWrappedInputs.set(Component, wrapInput(Component))
    }
    Component = autoWrappedInputs.get(Component)
  }
  useProps ??= (props: Record<string, any>) => props
  return { Component, useProps }
}

const autoWrappedInputs = new WeakMap<any, any>()

const ERRORS = {
  inputAlreadyDefined: (input: string) => `
    Custom input type "${input}" is already defined by another plugin. It will be overridden!
  `,
  inputNotFound: (input: string) => `
    Implementation for a custom input type "${input}" was not found!
  `
}
