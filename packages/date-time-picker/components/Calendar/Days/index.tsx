import { useMemo, useCallback, type ReactNode } from 'react'
import { css, pug, observer } from 'startupjs'
import Span from '@startupjs-ui/span'
import Div from '@startupjs-ui/div'
import { useMoment } from '../../../helpers'

interface DaysProps {
  date: Date
  uiDate: number
  exactLocale: string
  timezone: string
  disabledDays: number[]
  maxDate?: number
  minDate?: number
  range?: [number, number]
  onChangeDate?: (value: number) => void
}

function Days ({
  date,
  uiDate,
  exactLocale,
  timezone,
  disabledDays,
  maxDate,
  minDate,
  range,
  onChangeDate
}: DaysProps): ReactNode {
  const moment = useMoment()
  const weekdaysShort = useMemo(() => {
    const data = (moment
      .tz(uiDate, timezone)
      .locale(exactLocale))
      ._locale
      ._weekdaysShort

    return data.map((day: string) => day.toUpperCase())
  }, [uiDate, timezone, exactLocale, moment])

  const matrixMonthDays = useMemo(() => {
    const data = []

    const nowDate = moment.tz(timezone)

    const currentDay = moment
      .tz(uiDate, timezone)
      .startOf('M')
      .startOf('w')
      .hours(nowDate.hours())
      .minutes(nowDate.minutes())
      .seconds(nowDate.seconds())
      .milliseconds(nowDate.milliseconds())

    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
      const weekLine = []
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        weekLine.push({
          label: currentDay.format('DD'),
          month: currentDay.month(),
          day: currentDay.date(),
          value: +currentDay,
          ariaLabel: currentDay.format('MMMM D, YYYY'),
          testID: `${currentDay.format('MM')}-` +
            `${currentDay.format('DD')}-${currentDay.format('YYYY')}`
        })
        currentDay.add(1, 'd')
      }
      data.push(weekLine)
    }

    return data
  }, [uiDate, timezone, moment])

  function _onChangeDay (item: any) {
    const timestamp = +moment
      .tz(uiDate, timezone)
      .date(item.day)
      .month(item.month)

    onChangeDate && onChangeDate(timestamp)
  }

  const isDisableDay = useCallback((value: number) => {
    const isDisabledDay = disabledDays.some(item => moment.tz(item, timezone).isSame(value, 'd'))
    const isBeforeMinDate = minDate != null
      ? moment.tz(minDate, timezone).isAfter(value, 'd')
      : false
    const isAfterMaxDate = maxDate != null
      ? moment.tz(maxDate, timezone).isBefore(value, 'd')
      : false

    return isDisabledDay || isBeforeMinDate || isAfterMaxDate
  }, [disabledDays, maxDate, minDate, timezone, moment])

  function getLabelActive (value: number) {
    return range
      ? moment.tz(value, timezone).isSame(range[0], 'd') ||
      moment.tz(value, timezone).isSame(range[1], 'd')
      : moment.tz(value, timezone).isSame(date, 'd')
  }

  return pug`
    Div.row(key='week-header' row role='row')
      for shortDayName in weekdaysShort
        Div.cell(key=shortDayName role='columnheader')
          Span.shortName(key='shortName-' + shortDayName bold)= shortDayName

    for week, weekIndex in matrixMonthDays
      // noop to prevent eslint error about missing 'week'. TODO: implement eslint disable comments support in pug
      - (week => {})(week)
      Div.row(key='week-' + weekIndex row role='row')
        for day, dayIndex in matrixMonthDays[weekIndex]
          Div.cell(
            key=weekIndex + '-' + dayIndex
            role='gridcell'
            aria-label=day.ariaLabel
            styleName={
              isActive: !range && moment.tz(day.value, timezone).isSame(date, 'd'),
              isActiveRangeStart: range && moment.tz(day.value, timezone).isSame(range[0], 'd'),
              isActiveRange: range && moment.tz(day.value, timezone).isBetween(range[0], range[1], 'd'),
              isActiveRangeEnd: range && moment.tz(day.value, timezone).isSame(range[1], 'd')
            }
            disabled=isDisableDay(day.value)
            testID=day.testID
            onPress=() => _onChangeDay(day)
          )
            Span.label(
              key='day-label-' + weekIndex + '-' + dayIndex
              bold=getLabelActive(day.value)
              styleName={
                isMute: !moment.tz(day.value, timezone).isSame(uiDate, 'M'),
                isActive: getLabelActive(day.value)
              }
            )= day.label
  `
}

export default observer(Days)

css`
  .shortName {
    color: var(--DateTimePicker-muted-color);
    font-size: var(--DateTimePicker-caption-font-size);
    line-height: var(--DateTimePicker-caption-line-height);
  }

  .label {
    font-size: var(--DateTimePicker-caption-font-size);
    line-height: var(--DateTimePicker-caption-line-height);
  }

  .label.isMute {
    color: var(--DateTimePicker-muted-color);
  }

  .label.isActive {
    color: var(--DateTimePicker-active-color);
  }

  .cell {
    justify-content: center;
    align-items: center;
    width: var(--DateTimePicker-day-cell-size);
    height: var(--DateTimePicker-day-cell-size);
    margin: var(--DateTimePicker-day-cell-margin);
    border-radius: var(--DateTimePicker-day-cell-radius);
  }

  .cell:part(hover) {
    background-color: var(--DateTimePicker-hover-bg);
  }

  .cell.isActive {
    background-color: var(--DateTimePicker-active-bg);
  }

  .cell.isActive:part(hover) {
    background-color: var(--DateTimePicker-active-hover-bg);
  }

  .cell.isActiveRangeStart {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: var(--DateTimePicker-active-bg);
  }

  .cell.isActiveRangeEnd {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: var(--DateTimePicker-active-bg);
  }

  .cell.isActiveRange {
    border-radius: 0;
    background-color: var(--DateTimePicker-range-bg);
  }

  .row {
    justify-content: center;
  }

  @media (--breakpoint-tablet) {
    .row {
      justify-content: flex-start;
    }
  }
`
