import React, { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons/faAngleDoubleLeft'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons/faAngleDoubleRight'
import usePagination from './usePagination'
import './index.cssx.styl'

const ICONS = {
  first: faAngleDoubleLeft,
  last: faAngleDoubleRight,
  previous: faAngleLeft,
  next: faAngleRight
}

export default observer(themed('Pagination', Pagination))

export const _PropsJsonSchema = {/* PaginationProps */} // used in docs generation

export interface PaginationProps {
  /** Custom styles applied to the root container */
  style?: StyleProp<ViewStyle>
  /** Display variant controlling layout @default 'full' */
  variant?: 'full' | 'compact'
  /** Zero-based page index */
  page?: number
  /** Scoped model for page index */
  $page?: any
  /** Total number of pages */
  pages?: number
  /** Number of items to skip before current page @default 0 */
  skip?: number
  /** Scoped model for skip value */
  $skip?: any
  /** Number of items per page @default 1 */
  limit?: number
  /** Scoped model for limit value */
  $limit?: any
  /** Total number of items @default 0 */
  count?: number
  /** Visible pages at the start and end @default 1 */
  boundaryCount?: number
  /** Visible sibling pages around the current page @default 1 */
  siblingCount?: number
  /** Show button for the first page @default false */
  showFirstButton?: boolean
  /** Show button for the last page @default false */
  showLastButton?: boolean
  /** Show previous page button @default true */
  showPrevButton?: boolean
  /** Show next page button @default true */
  showNextButton?: boolean
  /** Disable all navigation @default false */
  disabled?: boolean
  /** Called when the page changes */
  onChangePage?: (page: number) => void
  /** Called when the page size changes */
  onChangeLimit?: (limit: number) => void
}

function Pagination ({
  style,
  variant = 'full',
  page,
  $page,
  pages,
  skip = 0,
  $skip,
  limit = 1,
  $limit,
  count = 0,
  boundaryCount = 1, // min 1
  siblingCount = 1, // min 0
  showFirstButton = false,
  showLastButton = false,
  showPrevButton = true,
  showNextButton = true,
  disabled = false,
  onChangePage,
  onChangeLimit
}: PaginationProps): ReactNode {
  const items = usePagination({
    variant,
    page,
    $page,
    pages,
    skip,
    $skip,
    limit,
    $limit,
    count,
    boundaryCount,
    siblingCount,
    showFirstButton,
    showLastButton,
    showPrevButton,
    showNextButton,
    disabled,
    onChangePage,
    onChangeLimit
  })

  return pug`
    Div(row style=style)
      each item, index in items
        React.Fragment(key=index)
          - const { type, value, selected, disabled, ...itemProps } = item
          if type === 'page'
            Div.item(
              variant='highlight'
              shape='circle'
              disabled=disabled
              ...itemProps
            )
              Span.page(styleName={ selected })= value + 1
          else if ['first', 'last', 'previous', 'next'].includes(type)
            Div.item(
              variant='highlight'
              shape='circle'
              disabled=disabled
              ...itemProps
            )
              Icon.icon(
                styleName={disabled}
                icon=ICONS[type]
              )
          else if ~type.indexOf('ellipsis')
            Div.item
              Span ...
          else if type === 'status'
            Div.status(vAlign='center' row)
              Span= value
    `
}
