import React, { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed, useColors } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Link from '@startupjs-ui/link'
import Span from '@startupjs-ui/span'
import './index.cssx.styl'

type BreadcrumbsSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'

const DEPRECATED_SIZE_VALUES: BreadcrumbsSize[] = ['xs', 'xl', 'xxl']

export default observer(themed('Breadcrumbs', Breadcrumbs))

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
}

function Breadcrumbs ({
  style,
  routes = [],
  separator = '/',
  size = 'm',
  replace = false,
  iconPosition = 'left'
}: BreadcrumbsProps): ReactNode {
  if (DEPRECATED_SIZE_VALUES.includes(size)) {
    console.warn(
      `[@startupjs/ui] Breadcrumbs: size='${size}' is DEPRECATED, use one of 's', 'm', 'l' instead.`
    )
  }
  const getColor = useColors()

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
    Div(style=style wrap row)
      each route, index in routes
        - const { name, icon, to } = route
        - const isLastRoute = index === routes.length - 1
        React.Fragment(key=index)
          if isLastRoute
            = renderItem({ icon, color: getColor('text-secondary'), bold: true, children: name })
          else
            Div.item(row)
              Link(
                replace=replace
                to=to
              )
                = renderItem({ icon, color: getColor('text-description'), children: name })
              if typeof separator === 'string'
                Span.separator(styleName=[size])
                  | &nbsp#{separator}&nbsp
              else
                = separator
  `
}
