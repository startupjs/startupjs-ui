import React, { useState, useRef, useImperativeHandle, useEffect, type ReactNode, type RefObject } from 'react'
import {
  Dimensions,
  UIManager,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { pug, observer, $ } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Drawer from '@startupjs-ui/drawer'
import Popover, { type PopoverRef } from '@startupjs-ui/popover'
import DropdownCaption from './components/Caption'
import DropdownItem from './components/Item'
import { useKeyboard } from './helpers'
import STYLES from './index.cssx.styl'

export const _PropsJsonSchema = {/* DropdownProps */}

export interface DropdownProps {
  /** Ref to control dropdown programmatically */
  ref?: RefObject<DropdownRef>
  /** Custom styles applied to the dropdown content container */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the caption wrapper */
  captionStyle?: StyleProp<ViewStyle>
  /** Custom styles applied to the active item view */
  activeItemStyle?: StyleProp<ViewStyle>
  /** Dropdown caption and items */
  children?: ReactNode
  /** Currently selected value @default '' */
  value?: string | number
  /** Popover position @default 'bottom' */
  position?: 'top' | 'bottom' | 'left' | 'right'
  /** Popover attachment @default 'start' */
  attachment?: 'start' | 'center' | 'end'
  /** Fallback placements order */
  placements?: any
  /** Drawer items rendering variant @default 'buttons' */
  drawerVariant?: 'list' | 'buttons' | 'pure'
  /** Title shown in list drawer variant */
  drawerListTitle?: string
  /** Cancel button label in buttons drawer variant @default 'Cancel' */
  drawerCancelLabel?: string
  /** Disable caption press */
  disabled?: boolean
  /** Enable drawer behavior on small screens @default true */
  hasDrawer?: boolean
  /** Show swipe responder zone in drawer */
  showDrawerResponder?: boolean
  /** Called when item is selected */
  onChange?: (value: string | number | undefined) => void
  /** Called when dropdown is dismissed via overlay/cancel */
  onDismiss?: () => void
  /** Test id for the desktop/tablet popover surface (passed to `AbstractPopover`) */
  popoverTestID?: string
}

export interface DropdownRef {
  /** Open dropdown programmatically */
  open: () => void
  /** Close dropdown programmatically */
  close: () => void
}

// TODO: key event change scroll
function Dropdown ({
  style = [],
  captionStyle,
  activeItemStyle,
  children,
  value = '',
  position = 'bottom',
  attachment = 'start',
  placements,
  drawerVariant = 'buttons',
  drawerListTitle = '',
  drawerCancelLabel = 'Cancel',
  disabled,
  hasDrawer = true,
  showDrawerResponder,
  onChange,
  onDismiss,
  popoverTestID,
  ref
}: DropdownProps): ReactNode {
  const popoverRef = useRef<PopoverRef>(null)
  const refScroll = useRef<any>(null)
  const renderContent = useRef<any[]>([])
  const closeReason = useRef<null | 'toggle' | 'select' | 'dismiss' | 'resize'>(null)

  const $isShow = $(false)
  const [activeInfo, setActiveInfo] = useState<any>(null)
  const $layoutWidth = $(
    Math.min(Dimensions.get('window').width, Dimensions.get('screen').width)
  )

  const [selectIndexValue] = useKeyboard({
    value,
    isShow: $isShow.get(),
    renderContent,
    onChange: (v: any) => {
      closeReason.current = 'select'
      onChange && onChange(v)
    },
    onChangeShow: v => { handleVisibleChange(v) }
  })

  const isPopover = !hasDrawer || ($layoutWidth.get() > STYLES.media.tablet)

  function handleWidthChange () {
    closeReason.current = 'resize'
    popoverRef.current?.close?.()
    $isShow.set(false)
    $layoutWidth.set(Math.min(Dimensions.get('window').width, Dimensions.get('screen').width))
  }

  useEffect(() => {
    const listener = Dimensions.addEventListener('change', handleWidthChange)

    return () => {
      $isShow.del()
      listener?.remove?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useImperativeHandle(ref, () => ({
    open: () => {
      handleVisibleChange(true)
    },
    close: () => {
      handleVisibleChange(false, { reason: 'toggle' })
    }
  }))

  function handleVisibleChange (nextVisible: boolean, meta: { reason?: typeof closeReason.current } = {}) {
    if (typeof meta.reason !== 'undefined') closeReason.current = meta.reason

    if (isPopover) {
      if (nextVisible) {
        closeReason.current = null
        popoverRef.current?.open?.()
        $isShow.set(true)
      } else {
        popoverRef.current?.close?.()
        $isShow.set(false)
      }
      return
    }

    if (!nextVisible && closeReason.current === 'dismiss') onDismiss && onDismiss()
    $isShow.set(nextVisible)
  }

  function onLayoutActive ({ nativeEvent }: any) {
    setActiveInfo(nativeEvent.layout)
  }

  function onCancel () {
    handleVisibleChange(false, { reason: 'dismiss' })
  }

  function onRequestOpen () {
    const node = refScroll.current?.getScrollableNode
      ? refScroll.current.getScrollableNode()
      : refScroll.current

    if (!node) return

    UIManager.measure(node, (x, y, width, curHeight) => {
      if (activeInfo && activeInfo.y >= (curHeight - activeInfo.height)) {
        refScroll.current?.scrollTo?.({ y: activeInfo.y, animated: false })
      }
    })
  }

  let caption: ReactNode = null
  let activeLabel = ''
  renderContent.current = []

  React.Children.toArray(children).forEach((child: any, index, arr) => {
    if (child?.type === DropdownCaption) {
      if (index !== 0) Error('Caption need use first child')
      if (child.props.children) {
        caption = React.cloneElement(child, { variant: 'custom' })
      } else {
        caption = child
      }
      return
    }

    const _child = React.cloneElement(child, {
      _variant: child.props.children
        ? 'pure'
        : (isPopover ? 'popover' : drawerVariant),
      _styleActiveItem: activeItemStyle,
      _activeValue: value,
      _selectIndexValue: selectIndexValue,
      _index: caption ? (index - 1) : index,
      _childrenLength: caption ? (arr.length - 1) : arr.length,
      _onDismissDropdown: () => { handleVisibleChange(false) },
      _onChange: (v: any) => {
        closeReason.current = 'select'
        onChange && onChange(v)
        handleVisibleChange(false)
      }
    })

    if (value === child.props.value) {
      activeLabel = child.props.label
      renderContent.current.push(pug`
        View(
          key=index
          value=child.props.value
          onLayout=onLayoutActive
        )=_child
      `)
    } else {
      renderContent.current.push(_child)
    }
  })

  if (!caption) {
    caption = <DropdownCaption _activeLabel={activeLabel} />
  } else {
    caption = React.cloneElement(caption as any, { _activeLabel: activeLabel })
  }

  const _popoverStyle = StyleSheet.flatten(style)
  if ((caption as any).props?.variant === 'button' || (caption as any).props?.variant === 'custom') {
    ;(_popoverStyle as any).minWidth = 160
  }

  const matchAnchorWidth = !(_popoverStyle as any)?.width && !(_popoverStyle as any)?.minWidth

  if (isPopover) {
    const renderPopoverContent = (): ReactNode => pug`
      ScrollView(
        ref=refScroll
        showsVerticalScrollIndicator=false
        role=Platform.OS === 'web' ? 'listbox' : undefined
      )= renderContent.current
    `

    const handlePopoverCloseComplete = () => {
      $isShow.set(false)
      if (closeReason.current !== 'select' && closeReason.current !== 'toggle' && closeReason.current !== 'resize') {
        onDismiss && onDismiss()
      }
      closeReason.current = null
    }

    return pug`
      Popover(
        ref=popoverRef
        style=captionStyle
        attachmentStyle=_popoverStyle
        position=position
        attachment=attachment
        placements=placements
        matchAnchorWidth=matchAnchorWidth
        onOpenComplete=onRequestOpen
        onCloseComplete=handlePopoverCloseComplete
        renderContent=renderPopoverContent
        testID=popoverTestID
      )
        TouchableOpacity(
          disabled=disabled
          onPress=() => handleVisibleChange(!$isShow.get(), { reason: !$isShow.get() ? null : 'toggle' })
        )
          = caption
    `
  }

  return pug`
    if caption
      TouchableOpacity.caption(
        disabled=disabled
        onPress=() => handleVisibleChange(!$isShow.get())
      )
        = caption
    Drawer(
      visible=$isShow.get()
      position='bottom'
      style={ maxHeight: '100%' }
      styleName={ drawerReset: drawerVariant === 'buttons' }
      onDismiss=() => handleVisibleChange(false)
      onRequestOpen=onRequestOpen
      showResponder=showDrawerResponder
    )
      View.dropdown(styleName=drawerVariant)
        if drawerVariant === 'list'
          View.caption(styleName=drawerVariant)
            Text.captionText(styleName=drawerVariant)= drawerListTitle
        ScrollView.case(
          ref=refScroll
          showsVerticalScrollIndicator=false
          style=_popoverStyle
          styleName=drawerVariant
        )= renderContent.current
        if drawerVariant === 'buttons'
          TouchableOpacity(onPress=onCancel)
            View.button(styleName=drawerVariant)
              Text= drawerCancelLabel
  `
}

const ObservedDropdown: any = observer(themed('Dropdown', Dropdown))

ObservedDropdown.Caption = DropdownCaption
ObservedDropdown.Item = DropdownItem

export default ObservedDropdown
