import { useCallback, useMemo, type ReactNode } from 'react'
import { pug, observer, $ } from 'startupjs'
import Button from '@startupjs-ui/button'
import Div from '@startupjs-ui/div'
import FlatList from '@startupjs-ui/flat-list'
import Icon from '@startupjs-ui/icon'
import Popover from '@startupjs-ui/popover'
import Span from '@startupjs-ui/span'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import moment from 'moment-timezone'
import STYLES from './index.cssx.styl'

const yearsItemStyle = STYLES['years-item']
const YEAR_ITEM_HEIGHT = yearsItemStyle.height

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
  const monthName = moment.tz(uiDate, timezone).locale(exactLocale).format('MMM')

  const onChangeMonth = useCallback((value: number) => {
    const ts = +moment($uiDate.get()).add('month', value)
    $uiDate.set(ts)
  }, [$uiDate])

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
          variant='text'
          disabled=isPrevDisabled
          icon=faAngleLeft
          onPress=()=> onChangeMonth(-1)
        )
        Button.button(
          color='text-description'
          variant='text'
          disabled=isNextDisabled
          icon=faAngleRight
          onPress=()=> onChangeMonth(1)
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
  const $visible = $(false)
  const minYear = minDate ? moment.tz(minDate, timezone).year() : 1950
  const maxYear = maxDate ? moment.tz(maxDate, timezone).year() : 2050
  const yearsDiff = maxYear - minYear

  const onChangeYear = useCallback((year: number) => {
    const ts = +moment($uiDate.get()).year(year)
    $uiDate.set(ts)
    $visible.set(false)
  }, [$uiDate, $visible])

  const years = useMemo(() => {
    return new Array(yearsDiff + 1).fill(minYear).map((year, index) => {
      return year + index
    })
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
        keyExtractor=item => item
        getItemLayout=getItemLayout
      )
    `
  }

  function renderYear ({ item }: { item: number }): ReactNode {
    return pug`
      Div.years-item(
        variant='higlight'
        onPress=() => onChangeYear(item)
      )
        Span= item
    `
  }

  return pug`
    Div(style=style)
      Popover(
        $visible=$visible
        renderContent=renderYears
        attachmentStyleName='years-popover'
      )
        Div(vAlign='center' row)
          Span.year(bold)= moment.tz($uiDate.get(), timezone).year()
          Icon(icon=faCaretDown)
  `
})
