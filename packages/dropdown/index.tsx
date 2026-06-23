import React, { useState, useRef, useImperativeHandle, useEffect, type ReactNode, type RefObject } from 'react'
import {
  UIManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { css, pug, observer, $, themed, useDidUpdate, useMedia } from 'startupjs'

import Drawer from '@startupjs-ui/drawer'
import Popover, { type PopoverRef } from '@startupjs-ui/popover'
import ScrollView from '@startupjs-ui/scroll-view'
import DropdownCaption from './components/Caption'
import DropdownItem from './components/Item'
import { useKeyboard } from './helpers'

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
  /** Accessible name for the dropdown trigger */
  'aria-label'?: string
  /** Element id that labels the dropdown trigger */
  'aria-labelledby'?: string
  /** Element id that describes the dropdown trigger */
  'aria-describedby'?: string
  /** Enable drawer behavior on small screens @default true */
  hasDrawer?: boolean
  /** Show swipe responder zone in drawer */
  showDrawerResponder?: boolean
  /** Called when item is selected */
  onChange?: (value: string | number | undefined) => void
  /** Called when dropdown is dismissed via overlay/cancel */
  onDismiss?: () => void
  /** Test identifier for the dropdown trigger */
  testID?: string
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
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  hasDrawer = true,
  showDrawerResponder,
  onChange,
  onDismiss,
  testID,
  popoverTestID,
  ref
}: DropdownProps): ReactNode {
  const popoverRef = useRef<PopoverRef>(null)
  const refScroll = useRef<any>(null)
  const renderContent = useRef<any[]>([])
  const closeReason = useRef<null | 'toggle' | 'select' | 'dismiss' | 'resize'>(null)
  const media: any = useMedia()

  const $isShow = $(false)
  const [activeInfo, setActiveInfo] = useState<any>(null)

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

  const isPopover = !hasDrawer || media.tablet

  useEffect(() => {
    return () => {
      $isShow.del()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useDidUpdate(() => {
    closeReason.current = 'resize'
    popoverRef.current?.close?.()
    $isShow.set(false)
  }, [isPopover])

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
    const Caption = DropdownCaption as any
    caption = <Caption _activeLabel={activeLabel} />
  } else {
    caption = React.cloneElement(caption as any, { _activeLabel: activeLabel })
  }

  const _popoverStyle = StyleSheet.flatten(style)
  if ((caption as any).props?.variant === 'button' || (caption as any).props?.variant === 'custom') {
    ;(_popoverStyle as any).minWidth = 160
  }

  const matchAnchorWidth = !(_popoverStyle as any)?.width && !(_popoverStyle as any)?.minWidth
  const captionProps = (caption as any).props ?? {}
  const inferredCaptionLabel = captionProps['aria-label'] ?? captionProps.placeholder ?? activeLabel
  const captionLabel = (ariaLabel ?? (ariaLabelledBy ? undefined : inferredCaptionLabel)) || undefined

  if (isPopover) {
    const renderPopoverContent = (): ReactNode => pug`
      ScrollView(
        ref=refScroll
        showsVerticalScrollIndicator=false
        role='listbox'
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
          testID=testID
          disabled=disabled
          role='button'
          aria-label=captionLabel
          aria-labelledby=ariaLabelledBy
          aria-describedby=ariaDescribedBy
          aria-haspopup='listbox'
          aria-expanded=$isShow.get()
          aria-disabled=disabled
          onPress=() => handleVisibleChange(!$isShow.get(), { reason: !$isShow.get() ? null : 'toggle' })
        )
          = caption
    `
  }

  return pug`
    if caption
      TouchableOpacity.caption(
        testID=testID
        disabled=disabled
        role='button'
        aria-label=captionLabel
        aria-labelledby=ariaLabelledBy
        aria-describedby=ariaDescribedBy
        aria-haspopup='listbox'
        aria-expanded=$isShow.get()
        aria-disabled=disabled
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

const ObservedDropdown: any = themed('Dropdown', observer(Dropdown))

ObservedDropdown.Caption = DropdownCaption
ObservedDropdown.Item = DropdownItem

export default ObservedDropdown

css`
  .dropdown.list {
    padding: var(--Dropdown-list-padding);
    padding-bottom: var(--Dropdown-list-padding-bottom);
  }

  .dropdown.buttons {
    max-height: 100%;
  }

  .case.buttons {
    margin: var(--Dropdown-buttons-case-margin);
    border-radius: var(--Dropdown-buttons-radius);
    background-color: var(--Dropdown-buttons-bg);
  }

  .caption {
    align-self: flex-start;
  }

  .captionText.list {
    padding: var(--Dropdown-list-caption-padding);
    font-size: var(--Dropdown-list-caption-font-size);
    font-family: var(--Dropdown-list-caption-font-family);
    font-weight: var(--Dropdown-list-caption-font-weight);
  }

  .button.buttons {
    justify-content: center;
    align-items: center;
    margin: var(--Dropdown-buttons-cancel-margin);
    padding: var(--Dropdown-buttons-cancel-padding);
    border-radius: var(--Dropdown-buttons-radius);
    background-color: var(--Dropdown-buttons-bg);
  }

  .popover {
    border-radius: var(--Dropdown-popover-radius);
    box-shadow: var(--Dropdown-popover-shadow);
  }

  .drawerReset {
    background-color: transparent;
    height: auto;
    box-shadow: none;
    border-radius: 0;
  }
`
