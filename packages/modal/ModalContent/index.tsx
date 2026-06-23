import React, { type ReactNode, type ComponentType } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Span from '@startupjs-ui/span'
import ScrollView from '@startupjs-ui/scroll-view'

export const _PropsJsonSchema = {/* ModalContentProps */}

export interface ModalContentProps {
  /** Custom styles applied to the content */
  style?: StyleProp<ViewStyle>
  /** Content rendered inside modal */
  children?: ReactNode
  /** Component used for wrapping content @default ScrollView */
  ContentComponent?: ComponentType<any>
}

function ModalContent ({
  style,
  children,
  ContentComponent,
  ...props
}: ModalContentProps): ReactNode {
  const content = React.Children.map(children, (child): ReactNode => {
    if (typeof child === 'string') {
      return pug`
        Span= child
      `
    }
    return child
  })

  if (!ContentComponent) ContentComponent = ScrollView

  return pug`
    ContentComponent.root(
      part='root'
      style=style
      ...props
    )= content
  `
}

export default observer(themed('ModalContent', ModalContent))

css`
  .root {
    padding: var(--Modal-section-padding);
  }
`
