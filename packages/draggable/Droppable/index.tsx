import React, { useRef, useEffect, useContext, type ReactNode } from 'react'
import { View, StatusBar, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, $ } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import { DragDropContext } from '../DragDropProvider'

export const _PropsJsonSchema = {/* DroppableProps */}

export interface DroppableProps {
  /** Draggable items rendered inside the droppable area */
  children?: ReactNode
  /** Custom styles applied to the droppable container */
  style?: StyleProp<ViewStyle>
  /** Drop type (useful for filtering drags) */
  type?: string
  /** Unique droppable container id */
  dropId: string
  /** Called when active drag leaves this droppable */
  onLeave?: () => void
  /** Called when active drag enters this droppable */
  onHover?: () => void
}

function Droppable ({
  children,
  style,
  type,
  dropId,
  onLeave,
  onHover
}: DroppableProps): ReactNode {
  const ref = useRef<any>(null)
  const $dndContext = useContext(DragDropContext)
  const $isHover = $(false)

  useEffect(() => {
    $dndContext.drops[dropId].set({
      ref,
      items: React.Children.map(children as any, (child: any) => {
        return child?.props?.dragId
      })
    })
  }, [children, dropId, $dndContext])

  useEffect(() => {
    ref.current.measure((x: any, y: any, width: any, height: any, pageX: any, pageY: any) => {
      if (!$dndContext.activeData.dragId.get() || !$dndContext.dropHoverId.get()) {
        $isHover.set(false)
        return
      }

      const leftBorder = pageX
      const rightBorder = pageX + width
      const topBorder = pageY
      const bottomBorder = pageY + height

      const isHoverUpdate = (
        $dndContext.activeData.x.get() > leftBorder &&
        $dndContext.activeData.x.get() < rightBorder &&
        $dndContext.activeData.y.get() - (StatusBar.currentHeight ?? 0) > topBorder &&
        $dndContext.activeData.y.get() - (StatusBar.currentHeight ?? 0) < bottomBorder
      )

      if (isHoverUpdate && !$isHover.get()) {
        $dndContext.dropHoverId.set(dropId)
        onHover && onHover() // TODO
      }

      if (!isHoverUpdate && $isHover.get()) {
        onLeave && onLeave() // TODO
      }

      $isHover.set(isHoverUpdate)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify($dndContext.activeData.get())])

  const modChildren = React.Children.toArray(children).map((child: any, index) => {
    return React.cloneElement(child, {
      ...child.props,
      _dropId: dropId,
      _index: index
    })
  })

  const hasActiveDrag = $dndContext.drops[dropId].items.get()?.includes($dndContext.activeData.dragId.get())
  const activeStyle = hasActiveDrag ? { zIndex: 9999 } : {}
  const contextStyle = $dndContext.drops[dropId].style.get() || {}

  return pug`
    View(
      ref=ref
      style=[style, activeStyle, contextStyle]
    )= modChildren
  `
}

export default observer(themed('Droppable', Droppable))
