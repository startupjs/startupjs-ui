import { type ReactNode } from 'react'
import { css, pug, observer, themed } from 'startupjs'
import Div from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import Icon from '@startupjs-ui/icon'
import Button from '@startupjs-ui/button'

import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'

export interface DropdownCaptionProps {
  /** Caption content (used when `variant='custom'`) */
  children?: ReactNode
  /** Placeholder text shown when no active item */
  placeholder?: string
  /** Visual variant @default 'select' */
  variant?: 'select' | 'button' | 'custom'
  /** @private Active item label injected by Dropdown */
  _activeLabel?: string
}

function DropdownCaption ({
  children,
  placeholder = 'Select a state...',
  variant = 'select',
  _activeLabel
}: DropdownCaptionProps): ReactNode {
  if (variant === 'custom') return children

  if (variant === 'button') {
    return pug`
      Button(
        variant='flat'
        color='primary'
        pointerEvents='box-none'
      )= placeholder
    `
  }

  return pug`
    Div.select(row)
      Span.placeholder(styleName={ active: !!_activeLabel })
        = _activeLabel || placeholder
      Icon(icon=faAngleDown)
  `
}

export default observer(themed('DropdownCaption', DropdownCaption))

css`
  .select {
    background-color: var(--DropdownCaption-bg);
    height: var(--DropdownCaption-height);
    border-radius: var(--DropdownCaption-radius);
    border-style: solid;
    border-width: var(--DropdownCaption-border-width);
    border-color: var(--DropdownCaption-border-color);
    padding-left: var(--DropdownCaption-padding-x);
    padding-right: var(--DropdownCaption-padding-x);
    align-items: center;
    justify-content: space-between;
    min-width: var(--DropdownCaption-min-width);
  }

  .placeholder {
    color: var(--DropdownCaption-placeholder-color);
  }

  .active {
    color: var(--DropdownCaption-active-color);
  }
`
