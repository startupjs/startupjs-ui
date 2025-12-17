import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode,
  type RefObject
} from 'react'
import { Platform, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, useDidUpdate } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Drawer from '@startupjs-ui/drawer'
import Icon from '@startupjs-ui/icon'
import Popover from '@startupjs-ui/popover'
import ScrollView from '@startupjs-ui/scroll-view'
import Span from '@startupjs-ui/span'
import Tag from '@startupjs-ui/tag'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import './index.cssx.styl'

const IS_WEB = Platform.OS === 'web'

export default observer(themed('MultiSelect', MultiSelect))

export const _PropsJsonSchema = {/* MultiSelectProps */} // used in docs generation

export interface MultiSelectOption {
  label: any
  value: any
}

export interface MultiSelectProps {
  /** Custom styles for the Popover anchor wrapper */
  style?: StyleProp<ViewStyle>
  /** Custom styles for the input wrapper */
  inputStyle?: StyleProp<ViewStyle>
  /** Available options (objects with `{ label, value }` or primitives) @default [] */
  options?: Array<MultiSelectOption | string | number | boolean>
  /** Selected values @default [] */
  value?: any[]
  /** Placeholder text shown when empty @default 'Select' */
  placeholder?: string
  /** Disable interactions @default false */
  disabled?: boolean
  /** Render non-editable value @default false */
  readonly?: boolean
  /** Maximum number of visible tags (extra tags are collapsed) */
  tagLimit?: number
  /** Behavior when tags are limited (legacy prop) @default 'hidden' */
  tagLimitVariant?: 'hidden' | 'disabled'
  /** Maximum number of selectable tags */
  maxTagCount?: number
  /** Custom tag renderer */
  TagComponent?: any
  /** Custom input renderer */
  InputComponent?: any
  /** Match Popover width to anchor on web @default false */
  hasWidthCaption?: boolean
  /** Custom suggestion item renderer */
  renderListItem?: (options: { item: MultiSelectOption, index: number, selected: boolean }) => ReactNode
  /** Called when selected values change */
  onChange?: (value: any[]) => void
  /** Called when a value is selected */
  onSelect?: (value: any) => void
  /** Called when a value is removed */
  onRemove?: (value: any) => void
  /** Called when dropdown opens */
  onFocus?: () => void
  /** Called when dropdown closes */
  onBlur?: () => void
  /** Ref providing imperative `focus()` / `blur()` methods */
  ref?: RefObject<any>
  /** Error flag @private */
  _hasError?: boolean
}

function MultiSelect ({
  style,
  inputStyle,
  options = [],
  value = [],
  placeholder = 'Select',
  disabled = false,
  readonly = false,
  tagLimitVariant = 'hidden',
  TagComponent = DefaultTag,
  InputComponent,
  tagLimit,
  maxTagCount,
  hasWidthCaption = false,
  renderListItem,
  onChange,
  onSelect,
  onRemove,
  onFocus,
  onBlur,
  ref,
  _hasError,
  ...props
}: MultiSelectProps): ReactNode {
  const [focused, setFocused] = useState(false)
  const isOpenable = !(disabled || readonly)

  const normalizedOptions = useMemo(() => {
    return options.map(opt => typeof opt === 'object' && opt !== null
      ? opt
      : { label: opt, value: opt }
    )
  }, [options])

  const shouldDisableSelection = maxTagCount
    ? maxTagCount === value.length
    : false

  const focusHandler = useCallback(() => {
    if (isOpenable) setFocused(true)
  }, [isOpenable])

  const blurHandler = useCallback(() => { setFocused(false) }, [])

  const handleChangeVisible = (nextVisible: boolean) => {
    if (!nextVisible) {
      setFocused(false)
      return
    }
    if (!isOpenable) return
    setFocused(true)
  }

  useDidUpdate(() => {
    if (focused) onFocus && onFocus()
    else onBlur && onBlur()
  }, [focused])

  useImperativeHandle(ref, () => ({
    focus: focusHandler,
    blur: blurHandler
  }), [focusHandler, blurHandler])

  useDidUpdate(() => {
    if (focused && !isOpenable) blurHandler()
  }, [focused, isOpenable])

  function _onRemove (_value: any) {
    onRemove && onRemove(_value)
    onChange && onChange(value.filter(v => v !== _value))
  }

  function _onSelect (_value: any) {
    onSelect && onSelect(_value)
    onChange && onChange([...value, _value])
  }

  const onItemPress = (itemValue: any, selected: boolean) => (checked: boolean) => {
    if (disabled || readonly) return
    if (shouldDisableSelection && checked && !selected) return
    if (!checked) {
      _onRemove(itemValue)
    } else {
      _onSelect(itemValue)
    }
  }

  function _renderListItem ({ item, index }: { item: MultiSelectOption, index: number }): ReactNode {
    const { label, value: itemValue } = item
    const selected = value.includes(itemValue)
    const onPress = onItemPress(itemValue, selected)

    return pug`
      Div(
        key=itemValue
        vAlign='center'
        disabled=selected ? false : shouldDisableSelection
        onPress=() => onPress(!selected)
      )
        if renderListItem
          = renderListItem({ item, index, selected })
        else
          Div.suggestionItem(row)
            Span.label= label
            Div.check
              if selected
                Icon(icon=faCheck styleName='checkIcon')
    `
  }

  function renderContent (): ReactNode {
    return pug`
      ScrollView.suggestions-web
        each option, index in normalizedOptions
          = _renderListItem({ item: option, index })
    `
  }

  return IS_WEB
    ? pug`
      Popover.popover(
        part='root'
        ...props
        captionStyle=style
        visible=focused
        matchAnchorWidth=hasWidthCaption
        attachment='start'
        position='bottom'
        onChange=handleChangeVisible
        renderContent=renderContent
      )
        MultiSelectInput(
          part='input'
          style=inputStyle
          focused=focused
          value=value
          placeholder=placeholder
          tagLimit=tagLimit
          tagLimitVariant=tagLimitVariant
          options=normalizedOptions
          disabled=disabled
          readonly=readonly
          InputComponent=InputComponent
          TagComponent=TagComponent
          _hasError=_hasError
          onOpen=focusHandler
          onHide=blurHandler
        )
    `
    : pug`
      MultiSelectInput(
        part='input'
        style=inputStyle
        onOpen=focusHandler
        onHide=blurHandler
        focused=focused
        value=value
        placeholder=placeholder
        tagLimit=tagLimit
        tagLimitVariant=tagLimitVariant
        options=normalizedOptions
        disabled=disabled
        readonly=readonly
        InputComponent=InputComponent
        TagComponent=TagComponent
        _hasError=_hasError
      )
      Drawer.nativeListContent(
        part='root'
        visible=focused
        position='bottom'
        onDismiss=blurHandler
      )
        ScrollView.suggestions-native
          each option, index in normalizedOptions
            = _renderListItem({ item: option, index })
    `
}

function MultiSelectInput ({
  style,
  value,
  placeholder,
  options,
  disabled,
  readonly,
  focused,
  tagLimit,
  tagLimitVariant,
  TagComponent,
  InputComponent,
  onOpen,
  onHide,
  _hasError
}: {
  style?: StyleProp<ViewStyle>
  value: any[]
  placeholder?: string
  options: MultiSelectOption[]
  disabled?: boolean
  readonly?: boolean
  focused?: boolean
  tagLimit?: number
  tagLimitVariant?: 'hidden' | 'disabled'
  TagComponent?: any
  InputComponent?: any
  onOpen?: () => void
  onHide?: () => void
  _hasError?: boolean
}): ReactNode {
  const values = tagLimit ? value.slice(0, tagLimit) : value
  const hiddenTagsLength = tagLimit
    ? value.slice(tagLimit, value.length).length
    : 0

  const EffectiveInputComponent = InputComponent ?? DefaultInput

  return pug`
    EffectiveInputComponent(
      part='root'
      style=style
      value=values
      placeholder=placeholder
      disabled=disabled
      focused=focused
      readonly=readonly
      onOpen=onOpen
      onHide=onHide
      _hasError=_hasError
    )
      each value, index in values
        - const record = options.find(r => r.value === value) || {}
        - const isLast = index + 1 === values.length
        TagComponent(
          key=value
          index=index
          isLast=isLast
          record=record
        )
      if hiddenTagsLength
        Span.ellipsis ...
        DefaultTag(
          index=0
          record={ label: '+' + hiddenTagsLength }
        )
  `
}

function DefaultInput ({
  style,
  value = [],
  placeholder,
  disabled,
  focused,
  readonly,
  children,
  onOpen,
  onHide,
  _hasError,
  ref
}: {
  style?: StyleProp<ViewStyle>
  value?: any[]
  placeholder?: string
  disabled?: boolean
  focused?: boolean
  readonly?: boolean
  children?: ReactNode
  onOpen?: () => void
  onHide?: () => void
  _hasError?: boolean
  ref?: RefObject<any>
}): ReactNode {
  useImperativeHandle(ref, () => ({
    focus: () => { onOpen && onOpen() },
    blur: () => { onHide && onHide() }
  }), [onOpen, onHide])

  useEffect(() => {
    if (focused && disabled) onHide && onHide()
  }, [disabled, focused, onHide])

  return pug`
    if readonly
      Span= value.join(', ')
    else
      Div.input(
        style=style
        styleName={ disabled, focused, readonly, error: _hasError }
        onPress=disabled || readonly ? void 0 : onOpen
        wrap
        row
      )
        if !value.length
          Span.placeholder= placeholder || '-'

        = children
  `
}

function DefaultTag ({
  record,
  isLast
}: {
  record?: any
  isLast?: boolean
}): ReactNode {
  return pug`
    Tag.tag(
      styleName={ last: isLast }
      size='s'
      variant='flat'
      color='primary'
    )= record?.label
  `
}
