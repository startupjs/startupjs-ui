import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, themed } from 'startupjs'

import Button from '@startupjs-ui/button'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp'
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import './index.cssx.styl'

interface NumberInputButtonsProps {
  buttonStyle?: StyleProp<ViewStyle>
  mode?: 'none' | 'horizontal' | 'vertical'
  size?: 'l' | 'm' | 's'
  disabled?: boolean
  onIncrement?: (value: number) => void
}

function NumberInputButtons ({
  buttonStyle,
  mode,
  size,
  disabled,
  onIncrement
}: NumberInputButtonsProps): ReactNode {
  const buttonStyleNames = [mode]

  return pug`
    if mode !== 'none'
      Button.input-button.increase(
        style=buttonStyle
        styleName=buttonStyleNames
        focusable=false
        disabled=disabled
        icon=mode === 'horizontal' ? faPlus : faAngleUp
        size=size
        variant='outlined'
        onPress=() => onIncrement?.(1)
      )
      Button.input-button.decrease(
        style=buttonStyle
        styleName=buttonStyleNames
        focusable=false
        disabled=disabled
        icon=mode === 'horizontal' ? faMinus : faAngleDown
        size=size
        variant='outlined'
        onPress=() => onIncrement?.(-1)
      )
  `
}

export default observer(themed('NumberInput', NumberInputButtons))
