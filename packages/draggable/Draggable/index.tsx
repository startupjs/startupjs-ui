import React, { useContext, useEffect, useRef, type ReactNode } from 'react'
import { View, StyleSheet, Platform, type StyleProp, type ViewStyle } from 'react-native'
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

  useEffect(() => {
    if (!$dndContext) return
    if ($dndContext.drags[dragId]) {
      $dndContext.drags[dragId].set({ ref, style: {} })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragId, _dropId, _index])

  if (_dropId == null || _index == null || !$dndContext) {
    return pug`View(style=style)= children`
  }

  const dropId = _dropId
  const index = _index

  async function onHandlerStateChange ({ nativeEvent }: any) {
    const startAbsoluteX = nativeEvent.absoluteX ?? 0
    const startAbsoluteY = nativeEvent.absoluteY ?? 0

    if (nativeEvent.state === State.BEGAN) {
      const offsetX = nativeEvent.x ?? 0
      const offsetY = nativeEvent.y ?? 0
      const ghostLeft = startAbsoluteX - offsetX
      const ghostTop = startAbsoluteY - offsetY

      const flatStyle = StyleSheet.flatten(style) || {} as any
      const data: Record<string, any> = {
        type,
        dragId,
        dropId,
        dragStyle: {
          ...flatStyle,
          height: flatStyle.height ?? 0,
          width: flatStyle.width ?? 0
        },
        startPosition: { x: offsetX, y: offsetY },
        startGhostTop: ghostTop,
        x: startAbsoluteX,
        y: startAbsoluteY,
        ghostLeft,
        ghostTop
      }

      const applyDragStart = (measuredHeight: number | null, measuredWidth: number | null) => {
        if (measuredHeight != null || measuredWidth != null) {
          data.dragStyle = {
            ...data.dragStyle,
            ...(typeof measuredHeight === 'number' && { height: measuredHeight }),
            ...(typeof measuredWidth === 'number' && { width: measuredWidth })
          }
        }
        $dndContext.drags[dragId].style.set({ display: 'none' })
        $dndContext.assign({
          activeData: data,
          dropHoverId: dropId,
          dragHoverIndex: index
        })

        if (onDragBegin) {
          onDragBegin({
            dragId: data.dragId,
            dropId: data.dropId,
            dropHoverId: dropId,
            hoverIndex: index
          })
        }
      }

      if (ref.current?.measure) {
        ref.current.measure((_x: number, _y: number, dragWidth: number, dragHeight: number) => {
          applyDragStart(dragHeight, dragWidth)
        })
      } else {
        applyDragStart(null, null)
      }
    }

    if (nativeEvent.state === State.END) {
      const clearDragState = () => {
        $dndContext.assign({
          drags: { [dragId]: { style: {} } },
          activeData: {},
          dropHoverId: '',
          dragHoverIndex: null
        })
      }
      try {
        const finalY = nativeEvent.absoluteY ?? $dndContext.activeData.y.get()
        const finalX = nativeEvent.absoluteX ?? $dndContext.activeData.x.get()
        $dndContext.activeData.x.set(finalX)
        $dndContext.activeData.y.set(finalY)
        const activeDataSnap = { ...$dndContext.activeData.get(), y: finalY, x: finalX }
        const finalHoverIndex = await checkPosition(activeDataSnap)
        const hoverIndex = finalHoverIndex ?? $dndContext.dragHoverIndex.get()

        if (onDragEnd) {
          onDragEnd({
            dragId: $dndContext.activeData.dragId.get(),
            dropId: $dndContext.activeData.dropId.get(),
            dropHoverId: $dndContext.dropHoverId.get(),
            hoverIndex
          })
        }
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
    $dndContext.activeData.ghostLeft.set(left)
    $dndContext.activeData.ghostTop.set(top)
    $dndContext.activeData.x.set(nativeEvent.absoluteX)
    $dndContext.activeData.y.set(nativeEvent.absoluteY)
    checkPosition($dndContext.activeData.get())
  }

  async function checkPosition (activeData: any): Promise<number | null> {
    const ghostTopNow = activeData.ghostTop
    const ghostLeftNow = activeData.ghostLeft
    const ghostHeight = activeData.dragStyle?.height ?? 0
    const ghostWidth = activeData.dragStyle?.width ?? 0
    const refY = ghostTopNow != null ? ghostTopNow + ghostHeight / 2 : activeData.y
    const refX = ghostLeftNow != null ? ghostLeftNow + ghostWidth / 2 : activeData.x
    if (refY == null) return await Promise.resolve(null)

    const dropIds = Object.keys($dndContext.drops.get() ?? {})
    if (dropIds.length === 0) return await Promise.resolve(null)

    const measureDrop = async (id: string) => {
      const dref = $dndContext.drops[id].ref.current?.get()
      if (!dref?.measureInWindow && !dref?.measure) return await Promise.resolve(null)
      return await new Promise<{ id: string, left: number, right: number, top: number, bottom: number } | null>((resolve) => {
        if (typeof dref.measureInWindow === 'function') {
          dref.measureInWindow((x: number, y: number, w: number, h: number) => { resolve({ id, left: x, right: x + (w ?? 0), top: y, bottom: y + (h ?? 0) }) })
        } else {
          dref.measure((_x: number, _y: number, _w: number, dH: number, px: number, py: number) => {
            const top = py ?? _y
            const left = px ?? _x
            resolve({ id, left, right: left + (_w ?? 0), top, bottom: top + (dH ?? 0) })
          })
        }
      })
    }

    return await Promise.all(dropIds.map(measureDrop)).then((results) => {
      const hit = results.find((r) => r && refY >= r.top && refY < r.bottom && (refX == null || (refX >= r.left && refX < r.right)))
      const targetDropId = hit ? hit.id : dropIds[0]
      const fallback = results.find((r) => r && r.id === targetDropId)
      const dropTop = (hit ?? fallback)?.top ?? 0
      const dropBottom = (hit ?? fallback)?.bottom ?? 0
      $dndContext.dropHoverId.set(targetDropId)

      const items = $dndContext.drops[targetDropId].items.get() ?? []
      if (items.length === 0) {
        $dndContext.dragHoverIndex.set(0)
        return 0
      }

      const n = items.length
      const dropHeight = dropBottom - dropTop
      const slotHeight = dropHeight / n
      const rects: Array<{ top: number, bottom: number, height: number }> = []
      for (let i = 0; i < n; i++) {
        rects.push({
          top: dropTop + i * slotHeight,
          bottom: dropTop + (i + 1) * slotHeight,
          height: slotHeight
        })
      }

      if (refY < rects[0].top) {
        $dndContext.dragHoverIndex.set(0)
        return 0
      }
      if (refY >= rects[n - 1].bottom) {
        $dndContext.dragHoverIndex.set(n)
        return n
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
      return hoverIndex
    }).then(async (hoverIndex) => await Promise.resolve(hoverIndex))
  }

  const contextStyle = $dndContext.drags[dragId] ? ($dndContext.drags[dragId].style.get() ?? {}) : {}
  const flatStyle = StyleSheet.flatten(style) || {} as any

  const dragStyleRaw = $dndContext.activeData.dragStyle?.get()
  const dragStyle = dragStyleRaw && typeof dragStyleRaw === 'object' ? dragStyleRaw : null
  const getNum = (v: any): number | undefined =>
    v == null
      ? undefined
      : typeof v?.get === 'function'
        ? v.get()
        : typeof v === 'number'
          ? v
          : undefined
  const phHeight = dragStyle ? getNum(dragStyle.height) : undefined
  const phWidth = dragStyle ? getNum(dragStyle.width) : undefined

  const isActiveDrag = $dndContext.activeData.dragId.get() === dragId
  const ghostLeft = isActiveDrag ? ($dndContext.activeData.ghostLeft.get() ?? 0) : 0
  const ghostTop = isActiveDrag ? ($dndContext.activeData.ghostTop.get() ?? 0) : 0
  const ghostStyle: ViewStyle = {
    ...flatStyle,
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    left: ghostLeft,
    top: ghostTop,
    ...(typeof phWidth === 'number' && phWidth > 0 && { width: phWidth }),
    ...(typeof phHeight === 'number' && phHeight > 0 && { height: phHeight })
  }
  if (Platform.OS === 'web') {
    (ghostStyle as Record<string, unknown>).cursor = 'default'
  }

  const isShowPlaceholder =
    $dndContext.activeData.get() &&
    $dndContext.dropHoverId.get() === dropId &&
    $dndContext.dragHoverIndex.get() === index

  const isShowLastPlaceholder =
    $dndContext.activeData.get() &&
    $dndContext.dropHoverId.get() === dropId &&
    ($dndContext.drops[dropId].items.get() ?? []).length - 1 === index &&
    $dndContext.dragHoverIndex.get() === index + 1

  const placeholderStyle: ViewStyle = {
    ...flatStyle,
    backgroundColor: 'var(--color-bg-main-subtle-alt, #e5e7eb)' as any,
    minHeight: 32,
    borderRadius: flatStyle.borderRadius ?? 4,
    ...(typeof phHeight === 'number' && phHeight > 0 && { height: phHeight }),
    ...(typeof phWidth === 'number' && phWidth > 0 && { width: phWidth })
  }

  return pug`
    if isShowPlaceholder
      View(style=placeholderStyle)

    Portal
      if isActiveDrag
        View(style=ghostStyle)= children

    PanGestureHandler(
      onHandlerStateChange=onHandlerStateChange
      onGestureEvent=onGestureEvent
    )
      View(ref=ref style=[style, contextStyle])
        = children

    if isShowLastPlaceholder
      View(style=placeholderStyle)
  `
}

export default observer(themed('Draggable', Draggable), { cache: false })
