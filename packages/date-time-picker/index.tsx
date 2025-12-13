import {
  useMemo,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  type ReactNode,
  type RefObject
} from 'react'
import { Platform, type StyleProp, type ViewStyle } from 'react-native'
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { pug, observer, useBind, $ } from 'startupjs'
import { themed, useMedia } from '@startupjs-ui/core'
import Button from '@startupjs-ui/button'
import Div from '@startupjs-ui/div'
import Divider from '@startupjs-ui/divider'
import TextInput, { type UITextInputProps } from '@startupjs-ui/text-input'
import AbstractPopover from '@startupjs-ui/abstract-popover'
import Drawer from '@startupjs-ui/drawer'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'
import moment from 'moment-timezone'
import { getLocale } from './helpers'
import { Calendar, TimeSelect } from './components'
import './index.cssx.styl'

export default observer(themed('DateTimePicker', DateTimePicker))

export const _PropsJsonSchema = {/* DateTimePickerProps */}

export interface DateTimePickerProps extends Omit<UITextInputProps, 'value' | 'onChangeText' | 'ref'> {
  /** Ref to access underlying input */
  ref?: RefObject<any>
  /** Custom styles applied to the root input */
  style?: StyleProp<ViewStyle>
  /** Custom styles for content container */
  contentStyle?: Record<string, any>
  /** Date formatting string from moment */
  dateFormat?: string
  /** Picker display mode @default 'spinner' */
  display?: 'default' | 'spinner' | 'calendar' | 'clock'
  /** Minutes step for time selection @default 5 */
  timeInterval?: number
  /** Force 24 hour time format (auto-detected when not provided) */
  is24Hour?: boolean
  /** Input size preset @default 'm' */
  size?: 'l' | 'm' | 's'
  /** Picker type @default 'datetime' */
  mode?: 'date' | 'time' | 'datetime' | 'countdown'
  /** Custom renderer for input component */
  renderInput?: (inputProps: Record<string, any> & { onChangeVisible: (value: boolean) => void }) => ReactNode
  /** Locale identifier (falls back to device locale) */
  locale?: string
  /** Selected date range (start/end timestamps) */
  range?: [number, number]
  /** IANA timezone name @default moment.tz.guess() */
  timezone?: string
  /** Array of disabled day timestamps */
  disabledDays?: number[]
  /** Current value as timestamp */
  date?: number
  /** Disable interactions @default false */
  disabled?: boolean
  /** Render as readonly @default false */
  readonly?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Maximum available date as timestamp */
  maxDate?: number
  /** Minimum available date as timestamp */
  minDate?: number
  /** Controlled visibility */
  visible?: boolean
  /** Scoped model controlling visibility */
  $visible?: any
  /** Test identifier for the input */
  testID?: string
  /** Test identifier for calendar root */
  calendarTestID?: string
  /** Called when user presses input (native) */
  onPressIn?: (...args: any[]) => void
  /** Called with selected timestamp (or undefined when cleared) */
  onChangeDate?: (value?: number) => void
  /** Called before opening (controlled visibility mode) */
  onRequestOpen?: () => void
  /** Called before closing (controlled visibility mode) */
  onRequestClose?: () => void
  /** Error state flag @private */
  _hasError?: boolean
}

function DateTimePicker ({
  style,
  contentStyle = {},
  dateFormat,
  display = 'spinner',
  timeInterval = 5,
  is24Hour,
  size = 'm',
  mode = 'datetime',
  renderInput,
  locale,
  range,
  timezone = moment.tz.guess(),
  disabledDays = [],
  date,
  disabled,
  readonly,
  placeholder,
  maxDate,
  minDate,
  visible,
  $visible,
  testID,
  calendarTestID,
  onPressIn,
  onChangeDate,
  onRequestOpen,
  onRequestClose,
  _hasError,
  ref,
  ...props
}: DateTimePickerProps): ReactNode {
  const media: any = useMedia()
  const [textInput, setTextInput] = useState('')
  const refTimeSelect = useRef<any>(null)
  const inputRef = useRef<any>(null)
  const insets = useSafeAreaInsets()

  useImperativeHandle(ref, () => inputRef.current)

  function onDismiss () {
    onChangeVisible(false)
  }

  function getTimestampFromValue (value: any) {
    if (value?.nativeEvent?.timestamp) {
      return value.nativeEvent.timestamp
    }

    if (value instanceof Date) {
      return value.getTime()
    }

    return value
  }

  function showAndroidPicker () {
    const showTimepicker = (selectedDate: Date) => {
      ;(DateTimePickerAndroid as any).open({
        value: selectedDate,
        mode: 'time',
        display: 'time',
        is24Hour,
        onChange: (event: any, selectedTime: Date) => {
          if (event.type === 'set') {
            const finalDate = new Date(selectedDate)
            finalDate.setHours(selectedTime.getHours())
            finalDate.setMinutes(selectedTime.getMinutes())
            _onChangeDate(finalDate)
          } else {
            onDismiss()
          }
        }
      })
    }

    const showDatepicker = () => {
      ;(DateTimePickerAndroid as any).open({
        value: tempDate,
        mode: 'date',
        display: 'calendar',
        maximumDate: maxDate ? new Date(maxDate) : undefined,
        minimumDate: minDate ? new Date(minDate) : undefined,
        onChange: (event: any, selectedDate: Date) => {
          if (event.type === 'set') {
            if (mode === 'datetime') {
              showTimepicker(selectedDate)
            } else {
              _onChangeDate(selectedDate)
            }
          } else {
            onDismiss()
          }
        }
      })
    }

    switch (mode) {
      case 'date':
        showDatepicker()
        break
      case 'time':
        ;(DateTimePickerAndroid as any).open({
          value: tempDate,
          mode: 'time',
          display: 'clock',
          is24Hour,
          onChange: (event: any, selectedTime: Date) => {
            if (event.type === 'set') {
              _onChangeDate(selectedTime)
            } else {
              onDismiss()
            }
          }
        })
        break
      case 'datetime':
        showDatepicker()
        break
    }
  }

  let bindProps: any = useMemo(() => {
    if (typeof $visible !== 'undefined') return { $visible }
    if (typeof onRequestOpen === 'function' && typeof onRequestClose === 'function') {
      return {
        visible,
        onChangeVisible: (value: boolean) => {
          if (value) {
            onRequestOpen()
          } else {
            onRequestClose()
          }

          if (Platform.OS === 'android' && value) {
            showAndroidPicker()
          }
        }
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!bindProps) {
    $visible = $(false)
    bindProps = { $visible }
  }

  let { onChangeVisible } = bindProps
  ;({ visible, onChangeVisible } = useBind({ $visible, visible, onChangeVisible }) as any)

  const [tempDate, setTempDate] = useTempDate({ visible: !!visible, date, timezone })

  useEffect(() => {
    // Prevent crashes when custom renderer passed via props
    if (renderInput) return
    if (visible) {
      inputRef?.current?.focus?.()
    } else {
      inputRef?.current?.blur?.()
    }
  }, [visible, renderInput])

  const exactLocale = useMemo(() => {
    const locales = moment.locales()
    const _locale = locale ?? getLocale()
    return locales.includes(_locale) ? _locale : 'en'
  }, [locale])

  const _dateFormat = useMemo(() => {
    if (dateFormat) return dateFormat
    if (mode === 'datetime') {
      return (moment().locale(exactLocale) as any)._locale._longDateFormat.L + ' ' +
      (moment().locale(exactLocale) as any)._locale._longDateFormat.LT
    }

    if (mode === 'date') return (moment().locale(exactLocale) as any)._locale._longDateFormat.L
    if (mode === 'time') return (moment().locale(exactLocale) as any)._locale._longDateFormat.LT
  }, [mode, dateFormat, exactLocale])

  useEffect(() => {
    if (typeof date === 'undefined') {
      setTextInput('')
      return
    }

    const value = +moment.tz(date, timezone).seconds(0).milliseconds(0)
    setTextInput(moment.tz(value, timezone).format(_dateFormat))
    setTempDate(new Date(value))
  }, [date, timezone, _dateFormat, setTempDate])

  function _onChangeDate (value: any) {
    const timestamp = getTimestampFromValue(value)
    onChangeDate && onChangeDate(timestamp)
    onChangeVisible(false)
  }

  function _onPressIn (...args: any[]) {
    if (Platform.OS === 'android') {
      showAndroidPicker()
    }

    onChangeVisible(true)

    onPressIn && onPressIn(...args)
  }

  const inputProps: Record<string, any> = {
    style,
    ref: inputRef,
    disabled,
    readonly,
    size,
    placeholder,
    _hasError,
    value: textInput,
    testID,
    ...props
  }

  if (Platform.OS === 'web') {
    inputProps.editable = false
    inputProps.onFocus = _onPressIn
  }

  if (Platform.OS === 'android') {
    inputProps.onFocus = _onPressIn
    // Hide cursor for android
    inputProps.cursorColor = 'transparent'
  }

  if (Platform.OS === 'ios') {
    inputProps.onPressIn = _onPressIn
  }

  function handleRenderedInputPress (value: boolean) {
    if (Platform.OS === 'android' && value) {
      showAndroidPicker()
    }

    onChangeVisible(value)
  }

  const caption = pug`
    if renderInput
      = renderInput(Object.assign({ onChangeVisible: handleRenderedInputPress }, inputProps))
    else
      TextInput(
        showSoftInputOnFocus=false
        secondaryIcon=textInput && !renderInput ? faTimesCircle : undefined,
        onSecondaryIconPress=() => onChangeDate && onChangeDate()
        ...inputProps
      )
  `

  function renderPopoverContent (): ReactNode {
    return pug`
      Div.content(
        style={
          paddingBottom: (media.tablet && Platform.OS === 'ios') ? 0 : insets.bottom,
          ...contentStyle
        }
      )
        if Platform.OS === 'web'
          if (mode === 'date') || (mode === 'datetime')
            Calendar(
              date=tempDate
              exactLocale=exactLocale
              disabledDays=disabledDays
              locale=locale
              maxDate=maxDate
              minDate=minDate
              range=range
              timezone=timezone
              testID=calendarTestID
              onChangeDate=(newDate) => {
                setTempDate(newDate)
                if (mode === 'date') _onChangeDate(newDate)
              }
            )

          if mode === 'datetime'
            Divider.divider

          if (mode === 'time') || (mode === 'datetime')
            TimeSelect(
              date=tempDate
              ref=refTimeSelect
              maxDate=maxDate
              minDate=minDate
              timezone=timezone
              exactLocale=exactLocale
              is24Hour=is24Hour
              timeInterval=timeInterval
              onChangeDate=(newTime) => {
                const finalDate = new Date(tempDate)
                finalDate.setHours(new Date(newTime).getHours())
                finalDate.setMinutes(new Date(newTime).getMinutes())
                _onChangeDate(finalDate)
              }
            )
        else if Platform.OS === 'ios'
          Div.actions(row)
            Button(
              size='s'
              color='secondary'
              variant='text'
              onPress=() => {
                onDismiss()
              }
            ) Cancel
            Button(
              size='s'
              color='primary'
              variant='text'
              onPress=() => {
                _onChangeDate(tempDate)
              }
            ) Done
          RNDateTimePicker.rnPicker(
            value=tempDate
            display=display
            is24Hour=is24Hour
            disabled=disabled
            mode=mode
            themeVariant='light'
            textColor='#000000cc'
            maximumDate=maxDate ? new Date(maxDate) : undefined
            minimumDate=minDate ? new Date(minDate) : undefined
            timeZoneName=timezone
            onChange=(event, selectedDate) => {
              if (event.type !== 'dismissed') {
                setTempDate(selectedDate)
              }
            }
          )
    `
  }

  function renderWrapper (children: ReactNode): ReactNode {
    return pug`
      Div.popoverWrapper
        Div.popoverOverlay(feedback=false onPress=()=> onChangeVisible(false))
        = children
    `
  }

  return pug`
    // Android datetimepicker rendered inside its own modal
    if Platform.OS === 'android'
      = caption
    else
      if media.tablet
        = caption
        AbstractPopover.popover(
          visible=visible
          anchorRef=inputRef
          renderWrapper=renderWrapper
        )= renderPopoverContent()
      else
        = caption
        Drawer.drawer(
          visible=visible
          position='bottom'
          swipeStyleName='swipe'
          AreaComponent=Div
          onDismiss=onDismiss
        )= renderPopoverContent()
  `
}

function useTempDate ({
  visible,
  date,
  timezone
}: {
  visible: boolean
  date?: number
  timezone: string
}) {
  const [tempDate, setTempDate] = useState(getTempDate(date, timezone))

  useEffect(() => {
    const tempDate = getTempDate(date, timezone)
    setTempDate(tempDate)
  }, [visible, date, timezone])

  return [tempDate, setTempDate] as const
}

function getTempDate (date: number | undefined, timezone: string) {
  return date
    ? new Date(+moment.tz(date, timezone).seconds(0).milliseconds(0))
    : new Date()
}
