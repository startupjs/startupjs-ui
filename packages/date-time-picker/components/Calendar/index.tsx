import { type ReactNode } from 'react'
import { pug, observer, $ } from 'startupjs'
import Div from '@startupjs-ui/div'
import { useMoment } from '../../helpers'
import Header from './Header'
import Days from './Days'

interface CalendarProps {
  date: Date
  disabledDays?: number[]
  exactLocale: string
  timezone: string
  maxDate?: number
  minDate?: number
  range?: [number, number]
  testID?: string
  onChangeDate?: (value: number) => void
}

function Calendar ({
  date,
  disabledDays = [],
  exactLocale,
  timezone,
  maxDate,
  minDate,
  range,
  testID,
  onChangeDate
}: CalendarProps): ReactNode {
  const moment = useMoment()
  const $uiDate = $(+moment(date).seconds(0).milliseconds(0))

  return pug`
    Div(
      testID=testID
      role='grid'
      aria-label='Calendar'
    )
      Header(
        uiDate=$uiDate.get()
        exactLocale=exactLocale
        timezone=timezone
        minDate=minDate
        maxDate=maxDate
        $uiDate=$uiDate
      )
      Days(
        date=date
        uiDate=$uiDate.get()
        exactLocale=exactLocale
        timezone=timezone
        range=range
        minDate=minDate
        maxDate=maxDate
        disabledDays=disabledDays
        onChangeDate=onChangeDate
      )
  `
}

export default observer(Calendar)
