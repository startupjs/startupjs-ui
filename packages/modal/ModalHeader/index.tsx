import React, { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import './index.cssx.styl'

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
}

function ModalHeader ({
  style,
  children,
  onCrossPress, // @private
  closeIcon = faTimes,
  iconStyle,
  titleId
}: ModalHeaderProps): ReactNode {
  return pug`
    Div.root(row style=style styleName=children ? 'between' : 'right' vAlign='center')
      if typeof children === 'string'
        Span.title(id=titleId numberOfLines=1)= children
      else if titleId
        Div.titleHost(id=titleId)
          = children
      else
        = children
      if onCrossPress
        Div.close(onPress=onCrossPress)
          Span.srOnly Close dialog
          Icon.icon(
            style=iconStyle
            icon=closeIcon
            size='xl'
          )
  `
}

export default observer(themed('ModalHeader', ModalHeader))
