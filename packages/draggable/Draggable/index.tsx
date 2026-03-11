import React, { useContext, useEffect, useRef, type ReactNode } from 'react'
import { Animated, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import { State, PanGestureHandler } from 'react-native-gesture-handler'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Portal from '@startupjs-ui/portal'
import { DragDropContext } from '../DragDropProvider'
import '../index.cssx.styl'

export const _PropsJsonSchema = {/* DraggableProps */}

export interface DraggableProps {
  /** Content rendered inside draggable item */
  children?: ReactNode
  /** Custom styles applied to the draggable item */
  style?: StyleProp<ViewStyle>
  /** Drag type (useful for filtering drop targets) */
  type?: string
  /** Unique draggable item id */
  dragId: string
  /** @private Drop id injected by Droppable */
  _dropId?: string
  /** @private Index injected by Droppable */
  _index?: number
  /** Called when drag begins */
  onDragBegin?: (options: {
    dragId: string
    dropId: string
    dropHoverId: string
    hoverIndex: number
  }) => void
  /** Called when drag ends */
  onDragEnd?: (options: {
    dragId: string
    dropId: string
    dropHoverId: string
    hoverIndex: number
  }) => void
}

function Draggable ({
  children,
  style,
  type,
  dragId,
  _dropId,
  _index,
  onDragBegin,
  onDragEnd
}: DraggableProps): ReactNode {
  const ref = useRef<any>(null)
  const $dndContext = useContext(DragDropContext)

  const animateStates = {
    left: new Animated.Value(0),
    top: new Animated.Value(0)
  }

  // init drags.dragId
  useEffect(() => {
    $dndContext.drags[dragId].set({ ref, style: {} })
  }, [ // eslint-disable-line react-hooks/exhaustive-deps
    dragId,
    _dropId,
    _index,
    $dndContext.drags[dragId].ref.current.get() // eslint-disable-line react-hooks/exhaustive-deps
  ])

  if (_dropId == null || _index == null || !$dndContext) {
    return pug`
      View(style=style)= children
    `
  }

  const dropId = _dropId
  const index = _index

  async function onHandlerStateChange ({ nativeEvent }: any) {
    const startAbsoluteX = nativeEvent.absoluteX ?? 0
    const startAbsoluteY = nativeEvent.absoluteY ?? 0
    const offsetX = nativeEvent.x ?? 0
    const offsetY = nativeEvent.y ?? 0
    const ghostLeft = startAbsoluteX - offsetX
    const ghostTop = startAbsoluteY - offsetY
    const flatStyle = StyleSheet.flatten(style) || {}
    const data: Record<string, unknown> = {
      type,
      dragId,
      dropId,
      dragStyle: {
        ...flatStyle,
        height: (flatStyle as any).height ?? 0,
        width: (flatStyle as any).width ?? 0
      },
      startPosition: { x: offsetX, y: offsetY },
      startGhostTop: ghostTop,
      x: startAbsoluteX,
      y: startAbsoluteY,
      ghostLeft,
      ghostTop
    }

    if (nativeEvent.state === State.BEGAN) {
      ref.current.measure((_dragX: any, _dragY: any, dragWidth: any, dragHeight: any) => {
        (data.dragStyle as any).height = dragHeight
        if (dragWidth != null) (data.dragStyle as any).width = dragWidth

        const dropRef = $dndContext.drops[dropId].ref.current?.get?.()
        const doAssign = () => {
          $dndContext.drags[dragId].style.set({ display: 'none' })
          $dndContext.assign({
            activeData: data,
            dropHoverId: dropId,
            dragHoverIndex: index
          })

          onDragBegin && onDragBegin({
            dragId: data.dragId as string,
            dropId: data.dropId as string,
            dropHoverId: dropId,
            hoverIndex: index
          })
        }

        if (dropRef?.measureInWindow) {
          dropRef.measureInWindow((_x: number, _y: number, _w: number, _h: number) => doAssign())
        } else if (dropRef?.measure) {
          dropRef.measure((_x: number, _y: number, _w: number, _h: number, _px: number, _py: number) => doAssign())
        } else {
          doAssign()
        }
      })
    }

    if (nativeEvent.state === State.END) {
      animateStates.left.setValue(0)
      animateStates.top.setValue(0)

      const clearDragState = () => {
        $dndContext.assign({
          drags: { [dragId]: { style: {} } },
          activeData: {},
          dropHoverId: '',
          dragHoverIndex: null
        })
      }
      try {
        const finalY = nativeEvent.absoluteY ?? $dndContext.activeData.y?.get?.()
        const finalX = nativeEvent.absoluteX ?? $dndContext.activeData.x?.get?.()
        $dndContext.activeData.x?.set?.(finalX)
        $dndContext.activeData.y?.set?.(finalY)
        const activeDataSnap = { ...$dndContext.activeData.get(), y: finalY, x: finalX }
        const finalHoverIndex = await checkPosition(activeDataSnap)
        const hoverIndex = finalHoverIndex != null ? finalHoverIndex : $dndContext.dragHoverIndex.get()

        onDragEnd && onDragEnd({
          dragId: $dndContext.activeData.dragId.get(),
          dropId: $dndContext.activeData.dropId.get(),
          dropHoverId: $dndContext.dropHoverId.get(),
          hoverIndex
        })
      } finally {
        clearDragState()
      }
    }

    if (nativeEvent.state === State.CANCELLED || nativeEvent.state === State.FAILED) {
      $dndContext.assign({
        drags: { [dragId]: { style: {} } },
        activeData: {},
        dropHoverId: '',
        dragHoverIndex: null
      })
    }
  }

  function onGestureEvent ({ nativeEvent }: any) {
    if (!$dndContext.dropHoverId.get()) return

    const left = nativeEvent.absoluteX - $dndContext.activeData.startPosition.x.get()
    const top = nativeEvent.absoluteY - $dndContext.activeData.startPosition.y.get()
    animateStates.left.setValue(left)
    animateStates.top.setValue(top)

    $dndContext.activeData.ghostLeft?.set?.(left)
    $dndContext.activeData.ghostTop?.set?.(top)
    $dndContext.activeData.x.set(nativeEvent.absoluteX)
    $dndContext.activeData.y.set(nativeEvent.absoluteY)
    checkPosition($dndContext.activeData.get())
  }

  function checkPosition (activeData: any): Promise<number | null> {
    const dropRef = $dndContext.drops[dropId].ref.current?.get?.()
    if (!dropRef?.measure && !dropRef?.measureInWindow) {
      return Promise.resolve(null)
    }

    return new Promise((resolve) => {
      const onMeasured = (dropTop: number, dropBottom: number) => {
        const ghostTopNow = activeData.ghostTop
        const ghostHeight = (activeData.dragStyle?.height ?? 0) as number
        const refY = ghostTopNow != null ? ghostTopNow + ghostHeight / 2 : activeData.y
        if (refY == null) {
          resolve(null)
          return
        }

        const items = $dndContext.drops[$dndContext.dropHoverId.get()]?.items?.get() || []
        if (items.length === 0) {
          $dndContext.dragHoverIndex.set(0)
          resolve(0)
          return
        }

        const n = items.length
        const dropHeight = dropBottom - dropTop
        const slotHeight = dropHeight / n
        const rects: { top: number, bottom: number, height: number }[] = []
        for (let i = 0; i < n; i++) {
          rects.push({
            top: dropTop + i * slotHeight,
            bottom: dropTop + (i + 1) * slotHeight,
            height: slotHeight
          })
        }

        if (refY < rects[0].top) {
          $dndContext.dragHoverIndex.set(0)
          resolve(0)
          return
        }
        if (refY >= rects[n - 1].bottom) {
          $dndContext.dragHoverIndex.set(n)
          resolve(n)
          return
        }

        const startGhostTop = activeData.startGhostTop ?? activeData.ghostTop
        const movingDown = ghostTopNow >= startGhostTop
        const upThreshold = 0.001
        let hoverIndex = 0
        for (let i = 0; i < n; i++) {
          const r = rects[i]
          if (refY >= r.top && refY < r.bottom) {
            const relY = r.height > 0 ? (refY - r.top) / r.height : 0
            if (movingDown) {
              hoverIndex = Math.min(i + 1, n)
            } else {
              hoverIndex = relY < upThreshold && i > 0 ? i - 1 : i
            }
            break
          }
          if (refY < r.top) {
            hoverIndex = i
            break
          }
          hoverIndex = i + 1
        }

        $dndContext.dragHoverIndex.set(hoverIndex)
        resolve(hoverIndex)
      }

      if (typeof dropRef.measureInWindow === 'function') {
        dropRef.measureInWindow((_dX: number, dY: number, _dW: number, dH: number) => {
          const dropTop = dY
          const dropBottom = dY + (dH ?? 0)
          onMeasured(dropTop, dropBottom)
        })
      } else {
        dropRef.measure((_dX: number, _dY: number, _dWidth: number, dHeight: number, _dPageX: number, dPageY: number) => {
          const dropTop = dPageY ?? _dY
          const dropBottom = dropTop + (dHeight ?? 0)
          onMeasured(dropTop, dropBottom)
        })
      }
    })
  }

  const contextStyle = $dndContext.drags[dragId].style.get() || {}
  const _style: any = StyleSheet.flatten([style, animateStates])

  const isShowPlaceholder = $dndContext.activeData.get() &&
    $dndContext.dropHoverId.get() === dropId &&
    $dndContext.dragHoverIndex.get() === index

  const isShowLastPlaceholder = $dndContext.activeData.get() &&
    $dndContext.dropHoverId.get() === dropId &&
    $dndContext.drops[dropId].items.get().length - 1 === index &&
    $dndContext.dragHoverIndex.get() === index + 1

  const placeholder = pug`
    View.placeholder(
      style={
        height: $dndContext.activeData.get() && $dndContext.activeData.dragStyle.get() && $dndContext.activeData.dragStyle.height.get(),
        marginTop: $dndContext.activeData.get() && $dndContext.activeData.dragStyle.get() && $dndContext.activeData.dragStyle.marginTop.get(),
        marginBottom: $dndContext.activeData.get() && $dndContext.activeData.dragStyle.get() && $dndContext.activeData.dragStyle.marginBottom.get()
      }
    )
  `

  return pug`
    if isShowPlaceholder
      = placeholder

    Portal
      if $dndContext.activeData.dragId.get() === dragId
        Animated.View(style=[
          _style,
          { position: 'absolute', cursor: 'default' }
        ])= children

    PanGestureHandler(
      onHandlerStateChange=onHandlerStateChange
      onGestureEvent=onGestureEvent
    )
      Animated.View(
        ref=ref
        style=[style, contextStyle]
      )= children

    if isShowLastPlaceholder
      = placeholder
  `
}

export default observer(themed('Draggable', Draggable), { cache: false })
