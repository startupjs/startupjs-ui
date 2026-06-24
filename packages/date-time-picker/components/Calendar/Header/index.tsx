import { useCallback, useMemo, type ReactElement, type ReactNode } from 'react'
import { css, pug, observer, $ } from 'startupjs'
import Button from '@startupjs-ui/button'
import Div from '@startupjs-ui/div'
import FlatList from '@startupjs-ui/flat-list'
import Icon from '@startupjs-ui/icon'
import Popover from '@startupjs-ui/popover'
import Span from '@startupjs-ui/span'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import { useMoment } from '../../../helpers'

const YEAR_ITEM_HEIGHT = 36

interface HeaderProps {
  uiDate: number
  exactLocale: string
  timezone: string
  minDate?: number
  maxDate?: number
  $uiDate: any
}

function Header ({
  uiDate,
  exactLocale,
  timezone,
  minDate,
  maxDate,
  $uiDate
}: HeaderProps): ReactNode {
  const moment = useMoment()
  const monthName = moment.tz(uiDate, timezone).locale(exactLocale).format('MMM')

  const onChangeMonth = useCallback((value: number) => {
    const ts = +moment($uiDate.get()).add('month', value)
    $uiDate.set(ts)
  }, [$uiDate, moment])

  const isPrevDisabled = minDate
    ? +moment.tz($uiDate.get(), timezone).endOf('month').add('month', -1) < minDate
    : false

  const isNextDisabled = maxDate
    ? +moment($uiDate.get()).startOf('month').add('month', 1) > maxDate
    : false

  return pug`
    Div.header(row)
      Div(vAlign='center' row)
        Span.month(bold)= monthName
        Years.years(
          timezone=timezone
          minDate=minDate
          maxDate=maxDate
          $uiDate=$uiDate
        )
      Div.actions(row)
        Button.button(
          color='text-description'
          variant='ghost'
          disabled=isPrevDisabled
          icon=faAngleLeft
          onPress=() => onChangeMonth(-1)
        )
        Button.button(
          color='text-description'
          variant='ghost'
          disabled=isNextDisabled
          icon=faAngleRight
          onPress=() => onChangeMonth(1)
        )
  `
}

export default observer(Header)

interface YearsProps {
  style?: any
  minDate?: number
  maxDate?: number
  timezone: string
  $uiDate: any
}

const Years = observer(function YearsComponent ({
  style,
  minDate,
  maxDate,
  timezone,
  $uiDate
}: YearsProps): ReactNode {
  const moment = useMoment()
  const $visible = $(false)
  const minYear = minDate ? moment.tz(minDate, timezone).year() : 1950
  const maxYear = maxDate ? moment.tz(maxDate, timezone).year() : 2050
  const yearsDiff = maxYear - minYear

  const onChangeYear = useCallback((year: number) => {
    const ts = +moment($uiDate.get()).year(year)
    $uiDate.set(ts)
    $visible.set(false)
  }, [$uiDate, $visible, moment])

  const years = useMemo(() => {
    return new Array(yearsDiff + 1).fill(minYear).map((year, index) => {
      return year + index
    }).reverse()
  }, [yearsDiff, minYear])

  const getItemLayout = useCallback((data: any, index: number) => {
    return {
      offset: YEAR_ITEM_HEIGHT * index,
      length: YEAR_ITEM_HEIGHT,
      index
    }
  }, [])

  if (!yearsDiff) {
    return pug`
      Div(style=style)
        Span.year(bold)= maxYear
    `
  }

  function renderYears (): ReactNode {
    return pug`
      FlatList(
        data=years
        renderItem=renderYear
        keyExtractor=item => String(item)
        getItemLayout=getItemLayout
      )
    `
  }

  function renderYear ({ item }: { item: number }): ReactElement {
    return pug`
      Div.years-item(
        variant='highlight'
        onPress=() => onChangeYear(item)
      )
        Span= item
    ` as ReactElement
  }

  return pug`
    Div(style=style)
      Popover.yearsPopover(
        $visible=$visible
        renderContent=renderYears
      )
        Div(vAlign='center' row)
          Span.year(bold)= moment.tz($uiDate.get(), timezone).year()
          Icon(icon=faCaretDown)
  `
})

css`
  .header {
    align-items: center;
    justify-content: center;
    margin-left: var(--DateTimePicker-header-margin-left);
    margin-bottom: var(--DateTimePicker-header-margin-bottom);
  }

  @media (--breakpoint-tablet) {
    .header {
      justify-content: space-between;
    }
  }

  .month {
    font-size: var(--DateTimePicker-heading-font-size);
    line-height: var(--DateTimePicker-heading-line-height);
  }

  .yearText {
    color: var(--DateTimePicker-primary-text-color);
    font-size: var(--DateTimePicker-heading-font-size);
    line-height: var(--DateTimePicker-heading-line-height);
  }

  .actions {
    justify-content: flex-end;
    margin-left: var(--DateTimePicker-header-actions-margin-left);
  }

  @media (--breakpoint-tablet) {
    .actions {
      margin-left: 0;
    }
  }

  .button,
  .years {
    margin-left: var(--DateTimePicker-header-button-margin-left);
  }

  .yearsPopover:part(attachment) {
    padding: 0;
    max-height: var(--DateTimePicker-years-popover-max-height);
  }

  .years-item {
    height: var(--DateTimePicker-years-item-height);
    align-items: center;
    justify-content: center;
    padding-left: var(--DateTimePicker-years-item-padding-x);
    padding-right: var(--DateTimePicker-years-item-padding-x);
  }

  .year {
    font-size: var(--DateTimePicker-heading-font-size);
    line-height: var(--DateTimePicker-heading-line-height);
  }
`
