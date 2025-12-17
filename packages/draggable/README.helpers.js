import React from 'react'
import { pug } from 'startupjs'
import Span from '@startupjs-ui/span'
import { Draggable, DragDropProvider, Droppable } from './index'

export function DragDropProviderSandbox ({ children, ...props }) {
  return pug`
    DragDropProvider(...props)
      if children
        = children
      else
        Droppable.droppable(dropId='sandbox-drop')
          Draggable.draggable(dragId='sandbox-drag')
            Span Drag me
  `
}

export function DroppableSandbox (props) {
  return pug`
    DragDropProvider
      Droppable.droppable(...props)
        Draggable.draggable(dragId='a')
          Span Item A
        Draggable.draggable(dragId='b')
          Span Item B
  `
}

export function DraggableSandbox ({ children, ...props }) {
  return pug`
    DragDropProvider
      Droppable.droppable(dropId='sandbox-drop')
        Draggable.draggable(...props)
          if children
            = children
          else
            Span Drag me
  `
}
