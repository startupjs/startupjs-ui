import React, { type ReactNode } from 'react'
import Collapsible from 'react-native-collapsible'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Span from '@startupjs-ui/span'
import './index.cssx.styl'

export const _PropsJsonSchema = {/* CollapseContentProps */}

export interface CollapseContentProps {
  /** Custom styles applied to the collapsible container */
  style?: any
  /** Content rendered inside the collapsible area */
  children?: ReactNode
  /** Whether the collapse is open (provided internally) */
  open?: boolean
  /** Collapse variant controlling paddings */
  variant?: 'full' | 'pure'
  /** Alignment of collapsed content */
  align?: 'top' | 'center' | 'bottom'
  /** Height when collapsed */
  collapsedHeight?: number
  /** Enable pointer events while collapsed */
  enablePointerEvents?: boolean
  /** Animation duration in ms */
  duration?: number
  /** Easing function or preset name */
  easing?: ((value: number) => number) | string
  /** Render children even when collapsed */
  renderChildrenCollapsed?: boolean
  /** Callback fired after collapse animation ends */
  onAnimationEnd?: () => void
}

function CollapseContent ({
  style,
  children,
  open,
  variant,
  ...props
}: CollapseContentProps): ReactNode {
  const content = React.Children.map(children as any, (child: any, index: number): ReactNode => {
    if (typeof child === 'string') {
      return pug`
        Span(key=index)= child
      `
    }
    return child
  })

  return pug`
    Collapsible.root(style=style styleName=[variant] collapsed=!open ...props)
      = content
  `
}

export default observer(themed('CollapseContent', CollapseContent))
