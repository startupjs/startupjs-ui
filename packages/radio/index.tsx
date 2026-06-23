import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer } from 'startupjs'
import Div from '@startupjs-ui/div'
import Input from './input'
import {
  type RadioOption,
  type RadioValue,
  getOptionLabel,
  getOptionDescription,
  stringifyValue
} from './helpers'

export default observer(Radio)

export const _PropsJsonSchema = {/* RadioProps */}

export interface RadioProps {
  /** Custom styles for the root wrapper */
  style?: StyleProp<ViewStyle>
  /** Custom styles for each option item */
  inputStyle?: StyleProp<ViewStyle>
  /** Current selected value */
  value?: RadioValue
  /** List of options @default [] */
  options?: RadioOption[]
  /** Render options in a row @default false */
  row?: boolean
  /** Disable interactions @default false */
  disabled?: boolean
  /** Render as non-interactive @default false */
  readonly?: boolean
  /** Change handler */
  onChange?: (value: any) => void
  /** Error flag @private */
  _hasError?: boolean
  /** Additional props forwarded to the radio group */
  [key: string]: any
}

function Radio ({
  style,
  inputStyle,
  value,
  options = [],
  row = false,
  disabled = false,
  readonly = false,
  onChange,
  _hasError,
  ...props
}: RadioProps): ReactNode {
  return pug`
    Div.root(
      part='root'
      ...props
      style=style
      styleName={ row }
      role='radiogroup'
      aria-disabled=disabled || readonly
    )
      each option, index in options
        - const optionValue = stringifyValue(option)
        - const checked = optionValue === stringifyValue(value)
        - const error = _hasError && (value ? checked : true)

        Input.input(
          part='input'
          key=optionValue
          style=inputStyle
          styleName={ row, first: !index }
          checked=checked
          value=optionValue
          description=getOptionDescription(option)
          error=error
          disabled=disabled
          readonly=readonly
          onChange=onChange
        )= getOptionLabel(option)
  `
}

css`
  .root.row {
    flex-direction: row;
  }

  .input.row {
    margin-left: var(--Radio-option-row-gap);
  }

  .input.first {
    margin-left: 0;
  }
`
