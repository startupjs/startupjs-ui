import React, { type ReactNode } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { pug, $ } from 'startupjs'

export const DragDropContext = React.createContext<any>({})

export const _PropsJsonSchema = {/* DragDropProviderProps */}

export interface DragDropProviderProps {
  /** Components rendered inside provider */
  children?: ReactNode
}

export default function DragDropProvider ({
  children
}: DragDropProviderProps): ReactNode {
  const $context = $({
    dropHoverId: '',
    dragHoverIndex: null,
    activeData: {},
    drops: {},
    drags: {}
  })

  return pug`
    DragDropContext.Provider(value=$context)
      GestureHandlerRootView
        = children
  `
}
