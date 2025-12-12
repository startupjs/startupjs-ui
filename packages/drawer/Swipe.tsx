import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { PanResponder, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import './index.cssx.styl'
import type { DrawerAnimateStates } from './animate'

const RESPONDER_STYLES = {
  left: { right: 0, width: '10%', height: '100%' },
  right: { left: 0, width: '10%', height: '100%' },
  bottom: { top: 0, width: '100%', height: '10%' },
  top: { bottom: 0, width: '100%', height: '10%' }
} satisfies Record<string, ViewStyle>

interface DrawerSwipeProps {
  position: 'left' | 'right' | 'top' | 'bottom'
  contentSize: { width?: number, height?: number }
  swipeStyle?: StyleProp<ViewStyle>
  isHorizontal: boolean
  isSwipe: boolean
  isInvertPosition: boolean
  animateStates: DrawerAnimateStates
  runHide: () => void
  runShow: () => void
}

function Swipe ({
  position,
  contentSize,
  swipeStyle,
  isHorizontal,
  isSwipe,
  isInvertPosition,
  animateStates,
  runHide,
  runShow
}: DrawerSwipeProps): ReactNode {
  const [startDrag, setStartDrag] = useState<number | null>(null)
  const [endDrag, setEndDrag] = useState(false)
  const [offset, setOffset] = useState<number | null>(null)

  const dragZoneValue = useMemo(() => {
    // 15 percent
    return isHorizontal
      ? (((contentSize.width ?? 0) / 100) * 15)
      : (((contentSize.height ?? 0) / 100) * 15)
  }, [contentSize, isHorizontal])

  useEffect(() => {
    if (offset === null) return
    if (endDrag) {
      const validOffset = isInvertPosition ? -offset : offset

      if (validOffset >= dragZoneValue) {
        runHide()
      } else {
        runShow()
      }

      setOffset(null)
      setStartDrag(null)
      setEndDrag(false)
      return
    }

    if (isInvertPosition && offset < 0) animateStates.position.setValue(offset)
    if (!isInvertPosition && offset > 0) animateStates.position.setValue(offset)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, endDrag])

  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderTerminationRequest: () => false,
    onShouldBlockNativeResponder: () => false,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => {
      return isHorizontal ? (gestureState.dx !== 0) : (gestureState.dy !== 0)
    },
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      return isHorizontal ? (gestureState.dx !== 0) : (gestureState.dy !== 0)
    },
    onPanResponderGrant: e => {
      if (isHorizontal) {
        setStartDrag(e.nativeEvent.locationX)
      } else {
        setStartDrag(e.nativeEvent.locationY)
      }
    },
    onPanResponderMove: (e, gesture) => {
      if (startDrag) {
        setOffset(isHorizontal ? gesture.dx : gesture.dy)
      }
    },
    onPanResponderEnd: () => {
      if (startDrag) setEndDrag(true)
    }
  }), [startDrag, isHorizontal])

  const _responder = !isSwipe ? { panHandlers: {} } : responder
  const _responderStyle = StyleSheet.flatten([
    RESPONDER_STYLES[position],
    swipeStyle
  ])

  return pug`
    View.responder(..._responder.panHandlers style=_responderStyle)
  `
}

export default observer(themed('Drawer', Swipe))
