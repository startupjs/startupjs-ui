import { useBind } from 'startupjs'

export interface UsePaginationProps {
  variant?: 'full' | 'compact'
  page?: number
  $page?: any
  pages?: number
  skip?: number
  $skip?: any
  limit?: number
  $limit?: any
  count?: number
  boundaryCount?: number
  siblingCount?: number
  showFirstButton?: boolean
  showLastButton?: boolean
  showPrevButton?: boolean
  showNextButton?: boolean
  disabled?: boolean
  onChangePage?: (page: number) => void
  onChangeLimit?: (limit: number) => void
}

type PaginationItemType =
  | 'page'
  | 'first'
  | 'last'
  | 'previous'
  | 'next'
  | 'status'
  | 'start-ellipsis'
  | 'end-ellipsis'

interface PaginationItem {
  onPress?: () => void
  type: PaginationItemType
  value: number | string | null
  selected: boolean
  disabled: boolean
}

export default function usePagination ({
  variant,
  page,
  $page,
  pages,
  skip,
  $skip,
  limit,
  $limit,
  count,
  boundaryCount = 1, // min 1
  siblingCount = 1, // min 0
  showFirstButton = false,
  showLastButton = false,
  showPrevButton = true,
  showNextButton = true,
  disabled,
  onChangePage,
  onChangeLimit
}: UsePaginationProps): PaginationItem[] {
  ({ page, onChangePage } = useBind({ $page, page, onChangePage }) as any)
  ;({ skip } = useBind({ $skip, skip }) as any)
  // TODO: Add selectbox to component to change limit
  ;({ limit, onChangeLimit } = useBind({ $limit, limit, onChangeLimit }) as any)

  if (page == null) {
    if (skip != null && limit != null) {
      page = Math.ceil(skip / limit)
    } else {
      throw new Error(
        '[@startupjs/ui] usePagination: page cannot be calculated'
      )
    }
  }

  if (pages == null) {
    if (count != null && limit != null) {
      pages = Math.ceil(count / limit)
    } else {
      throw new Error(
        '[@startupjs/ui] usePagination: pages cannot be calculated'
      )
    }
  }

  // min 1
  const pagesCount = pages != null && pages > 0 ? pages : 1
  const currentPage = page

  // Basic list of items to render
  const itemList: Array<PaginationItemType | number> = []

  if (showFirstButton) itemList.push('first')
  if (showPrevButton) itemList.push('previous')

  if (variant === 'compact') {
    itemList.push('status')
  } else {
    // this logic was taken from here
    // https://github.com/mui-org/material-ui/blob/master/packages/material-ui-lab/src/Pagination/usePagination.js
    const range = (start: number, end: number) => {
      const length = end - start + 1
      return Array.from({ length }, (_, i) => start + i)
    }

    const startPages = range(0, Math.min(boundaryCount, pagesCount) - 1)
    const endPages = range(Math.max(pagesCount - boundaryCount, boundaryCount), pagesCount - 1)

    const siblingsStart = Math.max(
      Math.min(
        // Natural start
        currentPage - siblingCount,
        // Lower boundary when page is high
        pagesCount - boundaryCount - siblingCount * 2 - 2
      ),
      // Greater than startPages
      boundaryCount + 1
    )

    const firstEndPage = endPages[0] ?? Number.NaN

    const siblingsEnd = Math.min(
      Math.max(
        // Natural end
        currentPage + siblingCount,
        // Upper boundary when page is low
        boundaryCount + siblingCount * 2 + 1
      ),
      // Less than endPages
      firstEndPage - 2
    )

    itemList.push(...startPages)

    // Start ellipsis
    if (siblingsStart > boundaryCount + 1) {
      itemList.push('start-ellipsis')
    } else if (boundaryCount + 1 < pagesCount - boundaryCount) {
      itemList.push(boundaryCount)
    }

    // Sibling pages
    itemList.push(...range(siblingsStart, siblingsEnd))

    // End ellipsis
    if (siblingsEnd < pagesCount - boundaryCount - 2) {
      itemList.push('end-ellipsis')
    } else if (pagesCount - boundaryCount > boundaryCount) {
      itemList.push(pagesCount - boundaryCount - 1)
    }

    itemList.push(...endPages)
  }

  if (showNextButton) itemList.push('next')
  if (showLastButton) itemList.push('last')

  // Map the button type to its page number
  const buttonPage = (type: PaginationItemType): number | null => {
    switch (type) {
      case 'first':
        return 0
      case 'previous':
        return currentPage - 1
      case 'next':
        return currentPage + 1
      case 'last':
        return pagesCount - 1
      default:
        return null
    }
  }

  // Convert the basic item list to pagination item props objects
  const items = itemList.map<PaginationItem>((item) => {
    if (typeof item === 'number') {
      return {
        onPress: () => { onChangePage?.(item) },
        type: 'page',
        value: item,
        selected: item === currentPage,
        disabled: Boolean(disabled)
      }
    }

    if (item === 'status') {
      return {
        type: item,
        value: `${currentPage + 1} of ${pagesCount}`,
        selected: false,
        disabled: Boolean(disabled)
      }
    }

    const value = buttonPage(item)
    const isDisabled: boolean = disabled
      ? true
      : (!item.includes('ellipsis') &&
          (item === 'next' || item === 'last' ? currentPage >= pagesCount - 1 : currentPage <= 0))

    return {
      onPress: () => { value !== null && onChangePage?.(value) },
      type: item,
      value,
      selected: false,
      disabled: isDisabled
    }
  })

  return items
}
