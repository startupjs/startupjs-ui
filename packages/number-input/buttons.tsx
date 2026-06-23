import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Button from '@startupjs-ui/button'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp'
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'

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
        part='button'
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
        part='button'
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

export default themed('NumberInput', observer(NumberInputButtons))

css`
  .input-button {
    position: absolute;
    border-color: var(--NumberInput-button-border-color);
  }

  .input-button.vertical {
    right: 0;
    height: 50%;
  }

  .input-button.vertical.increase {
    top: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .input-button.vertical.decrease {
    bottom: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 0;
  }

  .input-button.horizontal {
    top: 0;
    bottom: 0;
    height: auto;
  }

  .input-button.horizontal.increase {
    right: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .input-button.horizontal.decrease {
    left: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`
