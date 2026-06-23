import React, { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'

export const _PropsJsonSchema = {/* ModalHeaderProps */}

export interface ModalHeaderProps {
  /** Custom styles applied to the header container */
  style?: StyleProp<ViewStyle>
  /** Header content */
  children?: ReactNode
  /** Handler for closing cross @private */
  onCrossPress?: (event: any) => void
  /** Icon rendered inside close button @default faTimes */
  closeIcon?: object
  /** Style applied to the close icon */
  iconStyle?: StyleProp<ViewStyle>
  /** Web-only title id for dialog naming */
  titleId?: string
  /** Test identifier */
  testID?: string
}

function ModalHeader ({
  style,
  children,
  onCrossPress, // @private
  closeIcon = faTimes,
  iconStyle,
  titleId,
  testID
}: ModalHeaderProps): ReactNode {
  return pug`
    Div.root(part='root' row style=style testID=testID styleName=children ? 'between' : 'right' vAlign='center')
      if typeof children === 'string'
        Span.title(part='title' id=titleId numberOfLines=1)= children
      else
        = children
      if onCrossPress
        Div.close(part='close' onPress=onCrossPress)
          Span.srOnly(part='srOnly') Close dialog
          Icon.icon(
            part='icon'
            style=iconStyle
            icon=closeIcon
            size='xl'
          )
  `
}

export default themed('ModalHeader', observer(ModalHeader))

css`
  .root {
    padding: var(--Modal-section-padding);
  }

  .root.between {
    justify-content: space-between;
  }

  .root.right {
    justify-content: flex-end;
  }

  .title {
    font-size: var(--Modal-title-font-size);
    line-height: var(--Modal-title-line-height);
    font-weight: var(--Modal-title-font-weight);
    font-family: var(--Modal-title-font-family);
    flex: 1;
  }

  .close {
    margin-left: var(--Modal-close-gap);
  }

  .icon {
    color: var(--Modal-icon-color);
  }

  .srOnly {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`
