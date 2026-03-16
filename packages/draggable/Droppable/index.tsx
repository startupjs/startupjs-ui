import React, { useRef, useEffect, useContext, type ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
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
  /** Optional: explicit list of item ids (e.g. when list is controlled and may be empty) */
  items?: string[]
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
  items: itemsProp,
  onLeave,
  onHover
}: DroppableProps): ReactNode {
  const ref = useRef<any>(null)
  const $dndContext = useContext(DragDropContext)

  useEffect(() => {
    if (!$dndContext) return
    const fromProp = Array.isArray(itemsProp) && itemsProp.length > 0
    const items = fromProp
      ? itemsProp
      : React.Children.map(children as any, (child: any) => child?.props?.dragId)
    $dndContext.drops[dropId].set({
      ref,
      items: items ?? []
    })
  }, [children, dropId, itemsProp, $dndContext])

  if (!$dndContext) return children as ReactNode

  const modChildren = React.Children.toArray(children).map((child: any, index) =>
    React.cloneElement(child, { ...child.props, _dropId: dropId, _index: index })
  )

  const hasActiveDrag = ($dndContext.drops[dropId].items.get() ?? []).includes($dndContext.activeData.dragId?.get())
  const activeStyle = hasActiveDrag ? { zIndex: 9999 } : {}
  const contextStyle = $dndContext.drops[dropId].style?.get() ?? {}
  const items = $dndContext.drops[dropId].items.get() ?? []
  const isHoverTargetEmpty = $dndContext.activeData.get() && $dndContext.dropHoverId.get() === dropId && items.length === 0
  const emptyPlaceholderStyle: ViewStyle = { backgroundColor: 'var(--color-bg-main-subtle-alt, #e5e7eb)' as any, minHeight: 32, borderRadius: 4 }

  return pug`
    View(ref=ref style=[style, activeStyle, contextStyle])
      if isHoverTargetEmpty
        View(style=emptyPlaceholderStyle)
      = modChildren
  `
}

export default observer(themed('Droppable', Droppable))
