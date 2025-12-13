import {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useImperativeHandle,
  type ReactNode,
  type RefObject
} from 'react'
import { pug, observer } from 'startupjs'
import Div from '@startupjs-ui/div'
import FlatList from '@startupjs-ui/flat-list'
import Span from '@startupjs-ui/span'
import moment from 'moment-timezone'
import STYLES from './index.cssx.styl'

export interface TimeSelectRef {
  scrollToIndex: (date?: Date) => void
}

interface TimeSelectProps {
  date: Date
  exactLocale: string
  timezone: string
  is24Hour?: boolean
  minDate?: number
  maxDate?: number
  timeInterval: number
  onChangeDate?: (value: number) => void
  ref?: RefObject<TimeSelectRef>
}

// TODO: add displayTimeVariant
function TimeSelect ({
  date,
  exactLocale,
  timezone,
  is24Hour,
  minDate,
  maxDate,
  timeInterval,
  onChangeDate,
  ref
}: TimeSelectProps): ReactNode {
  const refScroll = useRef<any>(null)

  // we are looking for 'a' in current locale
  // to figure out whether to apply 12 hour format
  const _is24Hour = useMemo(() => {
    if (is24Hour != null) return is24Hour
    const lt = (moment().locale(exactLocale) as any)._locale._longDateFormat.LT
    return !/a/i.test(lt)
  }, [is24Hour, exactLocale])

  const preparedData = useMemo(() => {
    const res: Array<{ label: string, value: number, disabled: boolean }> = []

    let currentTimestamp = +moment.tz(date, timezone).locale(exactLocale).startOf('d')
    const endTimestamp = +moment.tz(date, timezone).locale(exactLocale).endOf('d')
    const intervalTimestamp = timeInterval * 60 * 1000

    const format = _is24Hour
      ? (moment.tz(date, timezone).locale(exactLocale) as any)._locale._longDateFormat.LT
      : 'hh:mm A'

    while (currentTimestamp < endTimestamp) {
      res.push({
        label: moment.tz(currentTimestamp, timezone).locale(exactLocale).format(format),
        value: currentTimestamp,
        disabled: (maxDate != null && currentTimestamp > maxDate) ||
          (minDate != null && currentTimestamp < minDate)
      })
      currentTimestamp += intervalTimestamp
    }

    return res
  }, [date, exactLocale, timezone, timeInterval, _is24Hour, maxDate, minDate])

  const scrollToIndex = useCallback((_date: Date = date) => {
    const dateTimestamp = +moment.tz(_date, timezone)
    const index = preparedData.findIndex(item => dateTimestamp === item.value)
    if (index === -1) return
    refScroll.current?.scrollToIndex?.({ index, animated: false })
  }, [date, timezone, preparedData])

  useImperativeHandle(ref, () => ({ scrollToIndex }), [scrollToIndex])
  useEffect(() => {
    scrollToIndex()
  }, [scrollToIndex])

  function renderItem ({ item }: { item: any }): ReactNode {
    const isActive = +moment(date) === item.value

    return pug`
      Div.cell(
        styleName={ isActive }
        disabled=item.disabled
        onPress=()=> onChangeDate && onChangeDate(item.value)
      )
        Span.label(styleName={ isActive })
          = item.label
    `
  }

  const length = STYLES.cell.height

  return pug`
    FlatList(
      ref=refScroll
      data=preparedData
      renderItem=renderItem
      getItemLayout=(data, index) => ({
        offset: length * index,
        length,
        index
      })
      keyExtractor=item=> String(item.value)
    )
  `
}

export default observer(TimeSelect)
