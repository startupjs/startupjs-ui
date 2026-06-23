import { Children, cloneElement, type ReactNode } from 'react'
import { Image, type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'
import Icon, { type IconProps } from '@startupjs-ui/icon'
import Link from '@startupjs-ui/link'
import Span from '@startupjs-ui/span'

export const _PropsJsonSchema = {/* ItemProps */} // used in docs generation

export interface ItemProps extends Omit<DivProps, 'style' | 'onPress'> {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the left part */
  leftStyle?: StyleProp<ViewStyle>
  /** Custom styles applied to the content part */
  contentStyle?: StyleProp<ViewStyle>
  /** Custom styles applied to the right part */
  rightStyle?: StyleProp<ViewStyle>
  /** Content rendered inside Item */
  children?: ReactNode
  /** Navigation target passed to Link wrapper */
  to?: string
  /** Image URL displayed on the left side */
  url?: string
  /** Icon displayed on the left side when no image is provided */
  icon?: IconProps['icon']
  /** onPress handler */
  onPress?: (event: any) => void
}

function Item ({
  style,
  leftStyle,
  contentStyle,
  rightStyle,
  children,
  to,
  url,
  icon,
  onPress,
  ...props
}: ItemProps): ReactNode {
  let Wrapper: any
  const extraProps: Record<string, any> = {}

  if (to) {
    Wrapper = Link
    extraProps.to = to
    extraProps.block = true
  } else {
    Wrapper = Div
  }

  let left: ReactNode = null
  let content: ReactNode = null
  let right: ReactNode = null
  const contentChildren: ReactNode[] = []

  Children.toArray(children).forEach((child: any) => {
    if (!child || typeof child !== 'object') {
      contentChildren.push(child)
      return
    }

    if (ItemLeft === child.type) {
      left = mergePartStyle(child, leftStyle)
      return
    }

    if (ItemRight === child.type) {
      right = mergePartStyle(child, rightStyle)
      return
    }

    if (ItemContent === child.type) {
      content = mergePartStyle(child, contentStyle)
      return
    }

    contentChildren.push(child)
  })

  if (!left) {
    if (icon) {
      left = pug`
        ItemLeft(style=leftStyle)
          Icon(icon=icon)
      `
    } else if (url) {
      left = pug`
        ItemLeft(style=leftStyle)
          Image.image(source={ uri: url })
      `
    }
  }

  content = content ??
    (contentChildren.length === 1
      ? pug`
        ItemContent(style=contentStyle)= contentChildren[0]
      `
      : pug`
        ItemContent(style=contentStyle)= contentChildren
      `
    )

  return pug`
    Wrapper.root(
      part='root'
      style=style
      variant="highlight"
      onPress=onPress
      ...extraProps
      ...props
    )
      = left
      = content
      = right
  `
}

export interface ItemLeftProps {
  /** Custom styles applied to the left part */
  style?: StyleProp<ViewStyle>
  /** Content rendered inside left part */
  children?: ReactNode
}

function ItemLeft ({ style, children }: ItemLeftProps): ReactNode {
  return pug`
    Div.left(style=style)= children
  `
}

export interface ItemContentProps {
  /** Custom styles applied to the content wrapper */
  style?: StyleProp<ViewStyle>
  /** Content rendered inside the content area */
  children?: ReactNode
}

function ItemContent ({ style, children }: ItemContentProps): ReactNode {
  return pug`
    if typeof children === 'string'
      Span.content(style=style numberOfLines=1)= children
    else
      Div.content(style=style)= children
  `
}

export interface ItemRightProps {
  /** Custom styles applied to the right part */
  style?: StyleProp<ViewStyle>
  /** Content rendered inside right part */
  children?: ReactNode
}

function ItemRight ({ style, children }: ItemRightProps): ReactNode {
  return pug`
    Div.right(style=style)= children
  `
}

const ObservedItem: any = observer(themed('Item', Item))

ObservedItem.Left = ItemLeft
ObservedItem.Content = ItemContent
ObservedItem.Right = ItemRight

export default ObservedItem

function mergePartStyle (child: any, style: StyleProp<ViewStyle>): ReactNode {
  if (!style) return child
  return cloneElement(child, {
    style: [style, child.props?.style]
  })
}

css`
  .root {
    padding: var(--Item-padding-y) var(--Item-padding-x);
    flex-direction: row;
    align-items: center;
  }

  .image {
    width: var(--Item-image-size);
    height: var(--Item-image-size);
    border-radius: var(--Item-image-radius);
  }

  .content {
    flex-grow: 1;
  }

  .left {
    margin-right: var(--Item-part-gap);
  }

  .right {
    margin-left: var(--Item-part-gap);
  }
`
