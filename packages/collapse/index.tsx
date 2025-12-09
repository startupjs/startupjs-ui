import React, { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, useBind } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div, { type DivProps } from '@startupjs-ui/div'
import CollapseHeader, { type CollapseHeaderProps } from './CollapseHeader'
import CollapseContent from './CollapseContent'
import './index.cssx.styl'

export const _PropsJsonSchema = {/* CollapseProps */}

export interface CollapseProps extends Omit<DivProps, 'style' | 'children' | 'variant' | 'align'> {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Content rendered inside Collapse or via Collapse.Content */
  children?: ReactNode
  /** Header title when no custom Collapse.Header is provided */
  title?: ReactNode
  /** Controlled open state @default false */
  open?: boolean
  /** Scoped model for open state */
  $open?: any
  /** Visual appearance variant @default 'full' */
  variant?: 'full' | 'pure'
  /** Icon displayed in header; true uses default caret @default true */
  icon?: CollapseHeaderProps['icon']
  /** Called when open state changes */
  onChange?: (open: boolean) => void
  /** Custom styles applied to the collapsible container */
  collapsibleContainerStyle?: StyleProp<ViewStyle>
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

function Collapse ({
  style,
  children,
  title,
  open = false,
  $open,
  variant = 'full',
  icon = true,
  onChange,
  collapsibleContainerStyle,
  align,
  collapsedHeight,
  enablePointerEvents,
  duration,
  easing,
  renderChildrenCollapsed,
  onAnimationEnd,
  ...props
}: CollapseProps): ReactNode {
  ;({ open, onChange } = useBind({ $open, open, onChange }) as any)

  let header: ReactNode | undefined
  let content: ReactNode | undefined
  const contentChildren: ReactNode[] = []

  React.Children.forEach(children as any, (child: any) => {
    if (!child) return

    switch (child.type) {
      case CollapseHeader:
        if (header) throw Error('[ui -> Collapse] You must specify a single <Collapse.Header>')
        header = child
        break
      case CollapseContent:
        if (content) throw Error('[ui -> Collapse] You must specify a single <Collapse.Content>')
        content = child
        break
      default:
        contentChildren.push(child as ReactNode)
    }
  })

  if (content && contentChildren.length > 0) {
    throw Error('[ui -> Collapse] React elements found directly within <Collapse>. ' +
      'If <Collapse.Content> is specified, you have to put all your content inside it')
  }

  const contentProps = {
    open,
    variant,
    style: collapsibleContainerStyle,
    align,
    collapsedHeight,
    enablePointerEvents,
    duration,
    easing,
    renderChildrenCollapsed,
    onAnimationEnd
  }
  content = content
    ? React.cloneElement(content as any, { ...contentProps, ...(content as any).props })
    : React.createElement(CollapseContent, contentProps, contentChildren)

  const headerProps = { open, variant, icon, onPress }
  header = header
    ? React.cloneElement(header as any, { ...headerProps, ...(header as any).props })
    : React.createElement(CollapseHeader, headerProps, title ?? '')

  function onPress () {
    onChange?.(!open)
  }

  return pug`
    Div.root(style=style ...props)
      = header
      = content
  `
}

const ObservedCollapse: any = observer(themed('Collapse', Collapse))
ObservedCollapse.Header = CollapseHeader
ObservedCollapse.Content = CollapseContent

export { default as CollapseHeader, _PropsJsonSchema as CollapseHeaderPropsJsonSchema } from './CollapseHeader'
export { default as CollapseContent, _PropsJsonSchema as CollapseContentPropsJsonSchema } from './CollapseContent'
export default ObservedCollapse
