import React, { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons/faAngleDoubleLeft'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons/faAngleDoubleRight'
import usePagination from './usePagination'

const ICONS = {
  first: faAngleDoubleLeft,
  last: faAngleDoubleRight,
  previous: faAngleLeft,
  next: faAngleRight
}
const ICON_TYPES = ['first', 'last', 'previous', 'next']

function isIconType (value: string): value is keyof typeof ICONS {
  return ICON_TYPES.includes(value)
}

export default themed('Pagination', observer(Pagination))

export const _PropsJsonSchema = {/* PaginationProps */} // used in docs generation

export interface PaginationProps {
  /** Custom styles applied to the root container */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to each navigation item */
  itemStyle?: StyleProp<ViewStyle>
  /** Custom styles applied to page labels */
  pageStyle?: StyleProp<any>
  /** Custom styles applied to navigation icons */
  iconStyle?: StyleProp<any>
  /** Custom styles applied to the status block */
  statusStyle?: StyleProp<ViewStyle>
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
  /** Test identifier */
  testID?: string
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
  onChangeLimit,
  testID
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
    Div(row part='root' style=style testID=testID)
      each item, index in items
        React.Fragment(key=index)
          - const { type, value, selected, disabled, ...itemProps } = item
          if type === 'page'
            Div.item(
              part='item'
              variant='highlight'
              shape='circle'
              disabled=disabled
              ...itemProps
            )
              Span.page(part='page' styleName={ selected })= Number(value) + 1
          else if isIconType(type)
            Div.item(
              part='item'
              variant='highlight'
              shape='circle'
              disabled=disabled
              ...itemProps
            )
              Icon.icon(
                part='icon'
                styleName={ disabled }
                icon=ICONS[type]
              )
          else if ~type.indexOf('ellipsis')
            Div.item(part='item')
              Span.page(part='page') ...
          else if type === 'status'
            Div.status(part='status' vAlign='center' row)
              Span= value
    `
}

css`
  .item {
    min-width: var(--Pagination-item-size);
    height: var(--Pagination-item-size);
    align-items: center;
    justify-content: center;
    padding-left: var(--Pagination-item-padding-x);
    padding-right: var(--Pagination-item-padding-x);
  }

  .page.selected {
    color: var(--Pagination-page-selected-color);
  }

  .status {
    margin-left: var(--Pagination-status-gap);
    margin-right: var(--Pagination-status-gap);
  }

  .icon {
    color: var(--Pagination-icon-color);
  }

  .icon.disabled {
    color: var(--Pagination-icon-disabled-color);
  }
`
