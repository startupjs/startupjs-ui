import { useState, useRef, useEffect, useMemo, type ReactNode } from 'react'
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import AbstractPopover from '@startupjs-ui/abstract-popover'
import FlatList from '@startupjs-ui/flat-list'
import Loader from '@startupjs-ui/loader'
import Menu from '@startupjs-ui/menu'
import TextInput from '@startupjs-ui/text-input'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import escapeRegExp from 'lodash/escapeRegExp'
import useKeyboard from './useKeyboard'
import './index.cssx.styl'

const SUPPORT_PLACEMENTS = [
  'bottom-start',
  'bottom-center',
  'bottom-end',
  'top-start',
  'top-center',
  'top-end'
] as const

interface AutoSuggestOptionObject {
  value?: any
  label?: string | number
}

type AutoSuggestOption = string | number | AutoSuggestOptionObject

type AutoSuggestValue = AutoSuggestOption | null | undefined

export const _PropsJsonSchema = {/* AutoSuggestProps */}

export interface AutoSuggestProps {
  /** Custom styles for the suggestion list container */
  style?: StyleProp<ViewStyle>
  /** Custom styles for the TextInput wrapper */
  captionStyle?: StyleProp<ViewStyle>
  /** Custom styles for the TextInput input field */
  inputStyle?: StyleProp<TextStyle>
  /** Custom styles for the clear icon */
  iconStyle?: StyleProp<TextStyle>
  /** Custom icon for the input */
  inputIcon?: any
  /** Options list (strings, numbers, or objects with value/label) @default [] */
  options?: AutoSuggestOption[]
  /** Current selected value */
  value?: AutoSuggestValue
  /** Placeholder text @default 'Select value' */
  placeholder?: string | number
  /** Custom item renderer (item, index, highlightedIndex) */
  renderItem?: (item: AutoSuggestOption, index: number, selectIndexValue: number) => ReactNode
  /** Show loader in the list @default false */
  isLoading?: boolean
  /** Disable input interactions */
  disabled?: boolean
  /** Render as non-interactive */
  readonly?: boolean
  /** Change handler for selected value */
  onChange?: (value?: any) => void | Promise<void>
  /** Called after the list is closed */
  onDismiss?: () => void
  /** Change handler for input text */
  onChangeText?: (text: string) => void
  /** Called when list scroll reaches the end */
  onScrollEnd?: () => void
  /** Test identifier */
  testID?: string
}

function getOptionLabel (option: AutoSuggestOption): any {
  return (option as AutoSuggestOptionObject)?.label ?? option
}

function stringifyValue (option: AutoSuggestValue): string {
  return JSON.stringify((option as AutoSuggestOptionObject)?.value ?? option)
}

function parseValue (value: string): any {
  return JSON.parse(value)
}

function getLabelFromValue (value: AutoSuggestValue, options: AutoSuggestOption[]): any {
  for (const option of options) {
    if (stringifyValue(value) === stringifyValue(option)) {
      return getOptionLabel(option)
    }
  }
}

function AutoSuggest ({
  style = {},
  captionStyle,
  inputStyle,
  iconStyle,
  options = [],
  value,
  placeholder = 'Select value',
  renderItem,
  isLoading = false,
  disabled,
  readonly,
  onChange,
  onDismiss,
  onChangeText,
  onScrollEnd,
  testID
}: AutoSuggestProps): ReactNode {
  const inputRef = useRef<any>(null)
  const [isShow, setIsShow] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [wrapperHeight, setWrapperHeight] = useState<number | null>(null)
  const [scrollHeightContent, setScrollHeightContent] = useState<number | null>(null)
  const [textToFilter, setTextToFilter] = useState<string | undefined>()
  const _options = useMemo(() => {
    const escapedText = escapeRegExp(textToFilter ?? '')
    return options.filter(option => {
      return new RegExp(escapedText, 'gi')
        .test(getLabelFromValue(option, options))
    })
  }, [options, textToFilter])

  const [selectIndexValue, setSelectIndexValue, onKeyPress] = useKeyboard({
    options: _options,
    onChange,
    onChangeShow: v => { setIsShow(v) }
  })

  const selectedLabel = useMemo(() => {
    return getLabelFromValue(value, options)
  }, [options, value])

  useEffect(() => {
    setInputValue(selectedLabel)
  }, [selectedLabel])

  function onClose () {
    setIsShow(false)
    setSelectIndexValue(-1)
    inputRef.current.blur()
    onDismiss?.()
  }

  function _onChangeText (text: string) {
    setInputValue(text)
    setTextToFilter(text)
    if (!text) onChange?.()
    setSelectIndexValue(-1)
    onChangeText?.(text)
  }

  async function _onPress (item: AutoSuggestOption) {
    onChange && await onChange(parseValue(stringifyValue(item)))
    onClose()
  }

  function _renderItem ({ item, index }: { item: AutoSuggestOption, index: number }): ReactNode {
    if (renderItem) {
      return pug`
        TouchableOpacity(
          key=index
          onPress=() => { void _onPress(item) }
        )= renderItem(item, index, selectIndexValue)
      `
    }

    return pug`
      Menu.Item.item(
        key=index
        styleName={ selectMenu: selectIndexValue === index }
        onPress=() => { void _onPress(item) }
        active=stringifyValue(item) === stringifyValue(value)
      )= getLabelFromValue(item, options)
    `
  }

  function onScroll ({ nativeEvent }: any) {
    if (nativeEvent.contentOffset.y + wrapperHeight === scrollHeightContent) {
      onScrollEnd?.()
    }
  }

  function onLayoutWrapper ({ nativeEvent }: any) {
    setWrapperHeight(nativeEvent.layout.height)
  }

  function onChangeSizeScroll (width: number, height: number) {
    setScrollHeightContent(height)
  }

  function renderWrapper (children: ReactNode): ReactNode {
    return pug`
      View.root
        TouchableWithoutFeedback(onPress=() => {
          setInputValue(selectedLabel)
          onClose()
        })
          View.overlay
        = children
    `
  }

  const matchAnchorWidth = !(style as ViewStyle)?.width && !(style as ViewStyle)?.maxWidth

  return pug`
    TextInput(
      ref=inputRef
      style=captionStyle
      inputStyle=inputStyle
      icon=value && !disabled ? faTimes : undefined
      iconPosition='right'
      iconStyle=iconStyle
      value=inputValue
      placeholder=placeholder
      disabled=disabled
      readonly=readonly
      onChangeText=_onChangeText
      onFocus=() => setIsShow(true)
      onKeyPress=onKeyPress
      onIconPress=() => { void onChange?.() }
      testID=testID
    )

    AbstractPopover(
      visible=(isShow || isLoading)
      anchorRef=inputRef
      matchAnchorWidth=matchAnchorWidth
      placements=SUPPORT_PLACEMENTS
      durationOpen=200
      durationClose=200
      renderWrapper=renderWrapper
      onCloseComplete=() => setTextToFilter()
    )
      if isLoading
        View.loaderCase
          Loader(size='s')
      else
        View.contentCase
          FlatList.content(
            style=style
            data=_options
            renderItem=_renderItem
            keyExtractor=item => stringifyValue(item)
            scrollEventThrottle=500
            keyboardShouldPersistTaps='always'
            onScroll=onScroll
            onLayout=onLayoutWrapper
            onContentSizeChange=onChangeSizeScroll
          )
  `
}

export default observer(themed('AutoSuggest', AutoSuggest))
