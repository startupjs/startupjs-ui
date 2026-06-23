import {
  useEffect,
  useMemo,
  useState,
  useRef,
  type ReactNode,
  type RefObject
} from 'react'
import {
  Platform,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Div from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import TextInput from '@startupjs-ui/text-input'
import Buttons from './buttons'

const IS_IOS = Platform.OS === 'ios'

export const _PropsJsonSchema = {/* NumberInputProps */}

export interface NumberInputProps {
  /** Custom styles for the wrapper */
  style?: StyleProp<ViewStyle>
  /** Custom styles for increment and decrement buttons */
  buttonStyle?: StyleProp<ViewStyle>
  /** Current numeric value */
  value?: number
  /** Input size preset @default 'm' */
  size?: 'l' | 'm' | 's'
  /** Buttons layout @default 'vertical' */
  buttonsMode?: 'none' | 'horizontal' | 'vertical'
  /** Disable interactions @default false */
  disabled?: boolean
  /** Render a non-editable value @default false */
  readonly?: boolean
  /** Maximum allowed value */
  max?: number
  /** Minimum allowed value */
  min?: number
  /** Increment step @default 1 */
  step?: number
  /** Units label displayed next to the value */
  units?: string
  /** Units position @default 'left' */
  unitsPosition?: 'left' | 'right'
  /** Return key type for the keyboard @default 'done' */
  returnKeyType?: string
  /** Handler triggered when numeric value changes */
  onChangeNumber?: (value?: number) => void
  /** Ref to access the underlying TextInput */
  ref?: RefObject<any>
  /** Custom styles for the input element */
  inputStyle?: StyleProp<TextStyle>
  /** Placeholder text */
  placeholder?: string | number
  /** Error flag @private */
  _hasError?: boolean
  [key: string]: any
}

function NumberInput ({
  style,
  buttonStyle,
  value,
  size = 'm',
  buttonsMode = 'vertical',
  disabled = false,
  readonly = false,
  max,
  min,
  step = 1,
  units,
  unitsPosition = 'left',
  onChangeNumber,
  returnKeyType = 'done',
  ref,
  ...props
}: NumberInputProps): ReactNode {
  const [inputValue, setInputValue] = useState<string | undefined>(undefined)
  const inputValueRef = useRef<string | undefined>(undefined)

  const precision = useMemo(() => {
    return String(step).split('.')?.[1]?.length || 0
  }, [step])

  const regexp = useMemo(() => {
    return precision > 0
      ? new RegExp('^-?\\d*(\\.(\\d{0,' + precision + '})?)?$')
      : /^-?\d*$/
  }, [precision])

  function updateInputValue (newValue: string | undefined) {
    inputValueRef.current = newValue
    setInputValue(newValue)
  }

  useEffect(() => {
    if (value == null) {
      updateInputValue('')
      return
    }

    if (!isNaN(value) && Number(inputValueRef.current) !== value) {
      let nextValue = value
      if (min != null && nextValue < min) {
        nextValue = min
      } else if (max != null && nextValue > max) {
        nextValue = max
      }

      nextValue = +nextValue.toFixed(precision)

      updateInputValue(String(nextValue))
      onChangeNumber && onChangeNumber(nextValue)
    }
  }, [value, min, max, precision, onChangeNumber])

  function onChangeText (newValue: string) {
    let formattedValue = newValue
    // replace comma with dot for some locales
    if (precision > 0) formattedValue = formattedValue.replace(/,/g, '.')

    if (!regexp.test(formattedValue)) return

    let updateValue: number | undefined
    // check for an empty string and undefined
    // and check for strings '-' or '.'
    // to convert newValue to number
    // otherwise should value should be undefined
    if (formattedValue && !isNaN(Number(formattedValue))) {
      const numericValue = Number(formattedValue)

      if ((min != null && numericValue < min) || (max != null && numericValue > max)) {
        // TODO: display tip?
        return
      }

      updateValue = numericValue
    }

    updateInputValue(formattedValue)

    // prevent update for the same values
    // for example
    // when add dot (values NUMBER and NUMBER. are the same)
    // when add -
    // when change value from -NUMBER to -
    if (updateValue === value) return

    onChangeNumber && onChangeNumber(updateValue)
  }

  function onIncrement (byNumber: number) {
    const newValue = +((value ?? 0) + byNumber * step).toFixed(precision)
    // we use string because this is the value for TextInput
    onChangeText(String(newValue))
  }

  function getReturnKeyType (): string | undefined {
    let res

    if (IS_IOS && returnKeyType === 'none') {
      res = 'default'
    } else {
      res = returnKeyType
    }

    return res
  }

  const extraStyleName: Record<string, any> = {}

  if (units) {
    extraStyleName[unitsPosition] = unitsPosition
  }

  const renderWrapper = (
    { style: wrapperStyle }: { style?: StyleProp<ViewStyle> },
    children: ReactNode
  ): ReactNode => {
    return pug`
      Div(part='root' style=wrapperStyle)
        Div.input-wrapper(
          part='wrapper'
          styleName=[extraStyleName, { readonly }]
          row
        )
          if units
            Span.input-units(
              part='units'
              styleName=[size, extraStyleName, { readonly }]
            )
              = units
          = children
    `
  }

  if (readonly) {
    return renderWrapper({
      style: [style]
    }, pug`
      Span= value
    `)
  }

  function renderInputWrapper (
    wrapperProps: { style?: StyleProp<ViewStyle> },
    children: ReactNode
  ): ReactNode {
    return renderWrapper(
      wrapperProps,
      pug`
        Div.input-container(styleName=[extraStyleName])
          Buttons(
            buttonStyle=buttonStyle
            mode=buttonsMode
            size=size
            disabled=disabled
            onIncrement=onIncrement
          )
          = children
      `)
  }

  return pug`
    TextInput(
      style=style
      ref=ref
      inputStyleName=['input-input', buttonsMode, size]
      value=inputValue
      size=size
      disabled=disabled
      keyboardType='numeric'
      returnKeyType=getReturnKeyType()
      onChangeText=onChangeText
      _renderWrapper=renderInputWrapper
      ...props
    )
  `
}

export default observer(
  themed('NumberInput', NumberInput)
)

css`
  .input-wrapper {
    flex-grow: 1;
  }

  .input-wrapper.right {
    flex-direction: row-reverse;
  }

  .input-wrapper.readonly {
    align-self: flex-start;
  }

  .input-units {
    align-self: center;
  }

  .input-units.l {
    font-size: var(--NumberInput-units-font-size-l);
    line-height: var(--NumberInput-units-line-height-l);
  }

  .input-units.readonly.left {
    margin-right: var(--NumberInput-units-readonly-gap);
  }

  .input-units.readonly.right {
    margin-left: var(--NumberInput-units-readonly-gap);
  }

  .input-container {
    flex-grow: 1;
    flex-shrink: 1;
  }

  .input-container.left {
    margin-left: var(--NumberInput-units-gap);
  }

  .input-container.right {
    margin-right: var(--NumberInput-units-gap);
  }

  .input-input.vertical.l {
    padding-right: var(--NumberInput-button-padding-l);
  }

  .input-input.vertical.m {
    padding-right: var(--NumberInput-button-padding-m);
  }

  .input-input.vertical.s {
    padding-right: var(--NumberInput-button-padding-s);
  }

  .input-input.horizontal.l {
    padding-left: var(--NumberInput-button-padding-l);
    padding-right: var(--NumberInput-button-padding-l);
  }

  .input-input.horizontal.m {
    padding-left: var(--NumberInput-button-padding-m);
    padding-right: var(--NumberInput-button-padding-m);
  }

  .input-input.horizontal.s {
    padding-left: var(--NumberInput-button-padding-s);
    padding-right: var(--NumberInput-button-padding-s);
  }
`
