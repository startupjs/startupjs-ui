import { useMemo, type ReactNode } from 'react'
import { Platform, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, $, useCssVariable, themed } from 'startupjs'
import { DragDropProvider, Draggable, Droppable } from '@startupjs-ui/draggable'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Select from '@startupjs-ui/select'
import Span from '@startupjs-ui/span'
import { faGripVertical } from '@fortawesome/free-solid-svg-icons/faGripVertical'
import { getOptionLabel, getOptionValue, stringifyValue, move } from './helpers'

function toNumber (value: unknown, fallback: number): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

export const _PropsJsonSchema = {/* RankProps */} // used in docs generation

export interface RankProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Options list (strings, numbers, or `{ value, label }` objects) @default [] */
  options?: any[]
  /** Current order as a list of option values @default [] */
  value?: any[]
  /** Disable drag-and-drop interactions @default false */
  disabled?: boolean
  /** Render a non-interactive ranked list @default false */
  readonly?: boolean
  /** Fired when order changes; receives array of option values */
  onChange?: (value: any[]) => void
  /** Test identifier */
  testID?: string
}

function Rank (props: RankProps): ReactNode {
  const {
    options = [],
    readonly = false,
    value = [],
    style
  } = props

  const sortedValue = useMemo(() => {
    return options.slice().sort((a, b) => {
      return value.findIndex(i => stringifyValue(i) === stringifyValue(a)) -
        value.findIndex(i => stringifyValue(i) === stringifyValue(b))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.toString()])

  return pug`
    if readonly
      RankReadonly(value=sortedValue style=style testID=props.testID)
    else
      RankInput(...props value=sortedValue)
  `
}

const RankInput = observer(function RankInput ({
  value,
  onChange,
  disabled,
  style,
  testID,
  ...props
}: {
  value: any[]
  onChange?: (value: any[]) => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
  [key: string]: any
}): ReactNode {
  const $width: any = $()
  const dropId = useMemo(() => $.id(), [])

  const itemPadding = toNumber(useCssVariable('--Rank-item-padding', 8), 8)
  const itemGap = toNumber(useCssVariable('--Rank-item-gap', 8), 8)
  const itemRadius = toNumber(useCssVariable('--Rank-item-radius', 6), 6)
  const itemBorderWidth = toNumber(useCssVariable('--Rank-item-border-width', 1), 1)
  const itemBg = useCssVariable('--Rank-item-bg', 'var(--color-background)')
  const disabledItemBg = useCssVariable('--Rank-item-bg-disabled', 'var(--color-muted)')
  const itemBorderColor = useCssVariable('--Rank-item-border-color', 'var(--color-border)')

  const selectOptions = useMemo(() => {
    return value.map((_o, i) => ({ label: i + 1, value: i }))
  }, [value])

  function onLayout (event: any) {
    $width.set(event.nativeEvent.layout.width)
  }

  function onMoveItem (oldIndex: number, newIndex: number) {
    const newItems = move(value, oldIndex, newIndex)
    onChange && onChange(newItems.map(i => getOptionValue(i)))
  }

  function onDragEnd ({ dragId, hoverIndex }: { dragId: string, hoverIndex: number }) {
    const oldIndex = value.findIndex(item => stringifyValue(item) === dragId)
    const newIndex = hoverIndex < oldIndex ? hoverIndex : hoverIndex - 1
    onMoveItem(oldIndex, newIndex)
  }

  function renderDragItem (item: any, index: number): ReactNode {
    const dragId = stringifyValue(item)

    function onSelectChange (newIndex: any) {
      onMoveItem(index, newIndex)
    }

    // HACK: Draggable component has some visual bugs if styles are not passed
    // through style object
    const extraStyle: any = disabled
      ? { backgroundColor: disabledItemBg }
      : Platform.OS === 'web'
        ? { cursor: 'pointer' }
        : undefined
    const itemStyle: any = [
      {
        padding: itemPadding,
        borderWidth: itemBorderWidth,
        borderRadius: itemRadius,
        marginTop: itemGap,
        backgroundColor: itemBg,
        borderColor: itemBorderColor
      },
      { width: $width.get() },
      extraStyle
    ]

    const Container: any = disabled ? Div : Draggable

    return pug`
      Container(
        style=StyleSheet.flatten(itemStyle)
        key=dragId
        dragId=dragId
        onDragEnd=onDragEnd
      )
        Div(row)
          Select(
            styleName='select'
            size='s'
            disabled=disabled
            showEmptyValue=false
            options=selectOptions
            value=index
            onChange=onSelectChange
          )
          Div.span
            Span= getOptionLabel(item)
          Div.right
            Icon.icon(icon=faGripVertical styleName={ disabled })
    `
  }

  return pug`
    Div(
      ...props
      style=style
      testID=testID
      onLayout=onLayout
    )
      Span.hint(italic) To rank the listed items drag and drop each item
      DragDropProvider
        Droppable.droppable(dropId=dropId)
          each option, index in value
            = renderDragItem(option, index)
  `
})

const RankReadonly = observer(function RankReadonly ({
  value,
  style,
  testID,
  ...props
}: {
  value: any[]
  style?: StyleProp<ViewStyle>
  testID?: string
  [key: string]: any
}): ReactNode {
  return pug`
    Div(style=style testID=testID ...props)
      each option, index in value
        Div.readonly(key=index row)
          Div.readonly-index
            Span #{index + 1}.&nbsp;
          Div.readonly-text
            Span= getOptionLabel(option)
  `
})

export default themed('Rank', observer(Rank))

css`
  .droppable {
    margin-top: var(--Rank-item-gap);
  }

  .span {
    flex-shrink: 1;
    flex-grow: 1;
    margin-left: var(--Rank-span-offset);
    justify-content: center;
  }

  .select {
    width: var(--Rank-select-width);
    flex-shrink: 0;
  }

  .readonly-index {
    min-width: var(--Rank-readonly-index-width);
  }

  .readonly-text {
    flex-shrink: 1;
    flex-grow: 1;
  }

  .right {
    flex-shrink: 0;
    justify-content: center;
    margin-left: var(--Rank-right-offset);
  }

  .icon.disabled {
    color: var(--Rank-icon-disabled-color);
  }

  .hint {
    font-size: var(--Rank-hint-font-size);
    line-height: var(--Rank-hint-line-height);
    margin-top: var(--Rank-item-gap);
  }
`
