import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  type ReactNode,
  type RefObject
} from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Div from '@startupjs-ui/div'
import Button from '@startupjs-ui/button'
import Picker from './picker'
import { getLabelColor } from './helpers'

export default themed('ColorPicker', observer(ColorPicker))

export const _PropsJsonSchema = {/* ColorPickerProps */}

export interface ColorPickerProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Current hex color value @default '#fff' */
  value?: string
  /** Disables opening and auto-closes picker @default false */
  disabled?: boolean
  /** Size of the button @default 'm' */
  size?: 's' | 'm' | 'l'
  /** Called with the selected hex color */
  onChangeColor?: (color: string) => void
  /** Test identifier */
  testID?: string
  /** Imperative ref to open/close picker */
  ref?: RefObject<any>
  /** Additional props forwarded to the color button */
  [key: string]: any
}

function ColorPicker ({
  style,
  size = 'm',
  value = '#fff',
  disabled = false,
  onChangeColor = () => {},
  testID,
  ref,
  ...props
}: ColorPickerProps): ReactNode {
  const [shown, setShown] = useState(false)
  const pickerRef = useRef<any>(null)

  useImperativeHandle(ref, () => pickerRef.current)

  useEffect(() => {
    if (shown && disabled) pickerRef.current?.hide?.()
  }, [disabled, shown])

  return pug`
    Div(style=style testID=testID)
      Picker(
        ref=pickerRef
        onChangeColor=(color) => {
          onChangeColor(color)
          setShown(false)
        }
      )
      Button.button(
        ...props
        disabled=disabled
        style={ backgroundColor: value }
        variant='flat'
        size=size
        textStyle={ color: getLabelColor(value) }
        onPress=() => {
          pickerRef.current?.show?.()
          setShown(true)
        }
      )= value.toUpperCase()
  `
}

css`
  .button {
    border-color: var(--ColorPicker-button-border-color);
    border-width: var(--ColorPicker-button-border-width);
  }
`
