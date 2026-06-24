import React, { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, useCssVariable, themed } from 'startupjs'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Link from '@startupjs-ui/link'
import Span from '@startupjs-ui/span'

type BreadcrumbsSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'

const DEPRECATED_SIZE_VALUES: BreadcrumbsSize[] = ['xs', 'xl', 'xxl']

export default themed('Breadcrumbs', observer(Breadcrumbs))

export const _PropsJsonSchema = {/* BreadcrumbsProps */}

export interface BreadcrumbRoute {
  /** Path to navigate to */
  to?: string
  /** Text label of the route */
  name?: string
  /** Icon displayed next to the label */
  icon?: object | (() => any)
}

export interface BreadcrumbsProps {
  /** Custom styles applied to the root container */
  style?: StyleProp<ViewStyle>
  /** List of breadcrumb routes to render */
  routes?: BreadcrumbRoute[]
  /** Separator displayed between routes @default '/' */
  separator?: string | ReactNode
  /** Size preset controlling text and icon dimensions @default 'm' */
  size?: BreadcrumbsSize
  /** Replace the current history entry instead of pushing */
  replace?: boolean
  /** Icon position relative to the label @default 'left' */
  iconPosition?: 'left' | 'right'
  /** Test identifier */
  testID?: string
}

function Breadcrumbs ({
  style,
  routes = [],
  separator = '/',
  size = 'm',
  replace = false,
  iconPosition = 'left',
  testID
}: BreadcrumbsProps): ReactNode {
  if (DEPRECATED_SIZE_VALUES.includes(size)) {
    console.warn(
      `[@startupjs/ui] Breadcrumbs: size='${size}' is DEPRECATED, use one of 's', 'm', 'l' instead.`
    )
  }
  const resolvedCurrentColor = useCssVariable(
    '--Breadcrumbs-current-color',
    'var(--color-foreground)'
  ) as string | undefined
  const resolvedLinkColor = useCssVariable(
    '--Breadcrumbs-link-color',
    'var(--color-muted-foreground)'
  ) as string | undefined
  const resolvedSeparatorColor = useCssVariable(
    '--Breadcrumbs-separator-color',
    'var(--color-muted-foreground)'
  ) as string | undefined

  function renderItem ({
    icon,
    color,
    bold,
    children
  }: {
    icon?: BreadcrumbRoute['icon']
    color?: string
    bold?: boolean
    children?: ReactNode
  }): ReactNode {
    const extraStyle = { color }
    return pug`
      Div(vAlign='center' reverse=iconPosition === 'right' row)
        if icon
          Div.iconWrapper(styleName=[size, iconPosition])
            Icon(style=extraStyle icon=icon size=size)
        Span.content(
          style=extraStyle
          styleName=[size]
          bold=bold
        )= children
    `
  }

  return pug`
    Div(part='root' style=style testID=testID wrap row)
      each route, index in routes
        - const { name, icon, to } = route
        - const isLastRoute = index === routes.length - 1
        React.Fragment(key=index)
          if isLastRoute
            = renderItem({ icon, color: resolvedCurrentColor, bold: true, children: name })
          else
            Div.item(row)
              Link(
                replace=replace
                to=to
              )
                = renderItem({ icon, color: resolvedLinkColor, children: name })
              if typeof separator === 'string'
                Span.separator(style={ color: resolvedSeparatorColor } styleName=[size])
                  | &nbsp#{separator}&nbsp
              else
                = separator
  `
}

css`
  .iconWrapper.left.xs,
  .iconWrapper.left.s,
  .iconWrapper.left.m {
    margin-right: var(--Breadcrumbs-icon-gap);
  }

  .iconWrapper.left.l,
  .iconWrapper.left.xl,
  .iconWrapper.left.xxl {
    margin-right: var(--Breadcrumbs-icon-gap-large);
  }

  .iconWrapper.right.xs,
  .iconWrapper.right.s,
  .iconWrapper.right.m {
    margin-left: var(--Breadcrumbs-icon-gap);
  }

  .iconWrapper.right.l,
  .iconWrapper.right.xl,
  .iconWrapper.right.xxl {
    margin-left: var(--Breadcrumbs-icon-gap-large);
  }

  .item {
    align-items: center;
  }

  .separator {
    margin-left: var(--Breadcrumbs-separator-gap);
    margin-right: var(--Breadcrumbs-separator-gap);
    color: var(--Breadcrumbs-separator-color);
  }

  .separator.xs,
  .content.xs {
    font-size: var(--Breadcrumbs-font-size-xs);
    line-height: var(--Breadcrumbs-line-height-xs);
  }

  .separator.s,
  .content.s {
    font-size: var(--Breadcrumbs-font-size-s);
    line-height: var(--Breadcrumbs-line-height-s);
  }

  .separator.m,
  .content.m {
    font-size: var(--Breadcrumbs-font-size-m);
    line-height: var(--Breadcrumbs-line-height-m);
  }

  .separator.l,
  .content.l {
    font-size: var(--Breadcrumbs-font-size-l);
    line-height: var(--Breadcrumbs-line-height-l);
  }

  .separator.xl,
  .content.xl {
    font-size: var(--Breadcrumbs-font-size-xl);
    line-height: var(--Breadcrumbs-line-height-xl);
  }

  .separator.xxl,
  .content.xxl {
    font-size: var(--Breadcrumbs-font-size-xxl);
    line-height: var(--Breadcrumbs-line-height-xxl);
  }
`
