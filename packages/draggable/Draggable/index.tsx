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

  if (_dropId == null || _index == null) {
    return pug`
      View(style=style)= children
    `
  }

  const dropId = _dropId
  const index = _index

  function onHandlerStateChange ({ nativeEvent }: any) {
    const data = {
      type,
      dragId,
      dropId,
      dragStyle: { ...StyleSheet.flatten(style) },
      startPosition: {
        x: nativeEvent.x,
        y: nativeEvent.y
      }
    }

    if (nativeEvent.state === State.BEGAN) {
      ref.current.measure((dragX: any, dragY: any, dragWidth: any, dragHeight: any) => {
        data.dragStyle.height = dragHeight

        $dndContext.drops[dropId].ref.current.get().measure((dx: any, dy: any, dw: any, dropHeight: any) => {
          // init states
          $dndContext.drags[dragId].style.set({ display: 'none' })
          $dndContext.assign({
            activeData: data,
            dropHoverId: dropId,
            dragHoverIndex: index
          })

          onDragBegin && onDragBegin({
            dragId: data.dragId,
            dropId: data.dropId,
            dropHoverId: dropId,
            hoverIndex: index
          })
        })
      })
    }

    if (nativeEvent.state === State.END) {
      animateStates.left.setValue(0)
      animateStates.top.setValue(0)

      onDragEnd && onDragEnd({
        dragId: $dndContext.activeData.dragId.get(),
        dropId: $dndContext.activeData.dropId.get(),
        dropHoverId: $dndContext.dropHoverId.get(),
        hoverIndex: $dndContext.dragHoverIndex.get()
      })

      // reset states
      $dndContext.assign({
        drags: {
          [dragId]: { style: {} }
        },
        activeData: {},
        dropHoverId: '',
        dragHoverIndex: null
      })
    }
  }

  function onGestureEvent ({ nativeEvent }: any) {
    if (!$dndContext.dropHoverId.get()) return

    animateStates.left.setValue(
      nativeEvent.absoluteX - $dndContext.activeData.startPosition.x.get()
    )
    animateStates.top.setValue(
      nativeEvent.absoluteY - $dndContext.activeData.startPosition.y.get()
    )

    $dndContext.activeData.x.set(nativeEvent.absoluteX)
    $dndContext.activeData.y.set(nativeEvent.absoluteY)
    checkPosition($dndContext.activeData.get())
  }

  function checkPosition (activeData: any) {
    $dndContext.drops[dropId].ref.current.get().measure(async (dX: any, dY: any, dWidth: any, dHeight: any, dPageX: any, dPageY: any) => {
      const positions: any[] = []
      let startPosition = dPageY
      let endPosition = dPageY

      const dragsLength = $dndContext.drops[$dndContext.dropHoverId.get()].items.get()?.length || 0

      for (let index = 0; index < dragsLength; index++) {
        if (!$dndContext.dropHoverId.get()) break

        const iterDragId = $dndContext.drops[$dndContext.dropHoverId.get()].items[index].get()

        await new Promise<void>(resolve => {
          const currentElement = $dndContext.drags[iterDragId].ref.current.get()
          if (!currentElement) {
            positions.push(null)
            resolve()
            return
          }
          currentElement.measure((x: any, y: any, width: any, height: any, pageX: any, pageY: any) => {
            if (index === 0) {
              startPosition = dPageY
              endPosition = dPageY + y + (height / 2)
            } else {
              startPosition = endPosition
              endPosition = pageY + (height / 2)
            }

            if (iterDragId === dragId) {
              positions.push(null)
            } else {
              positions.push({ start: startPosition, end: endPosition })
            }

            resolve()
          })
        })
      }

      positions.push({ start: endPosition, end: dPageY + dHeight })

      for (let index = 0; index < positions.length; index++) {
        const position = positions[index]
        if (!position) continue

        if (activeData.y > position.start && activeData.y < position.end) {
          $dndContext.dragHoverIndex.set(index)
          break
        }
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
