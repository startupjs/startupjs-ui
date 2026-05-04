import { createContext, Fragment, useContext, useEffect, useId, type ReactNode } from 'react'
import { pug, $, observer } from 'startupjs'

const PortalContext = createContext<any>(undefined)

export const _PropsJsonSchema = {/* PortalProps */}

export interface PortalProps {
  /** Content rendered into the portal host */
  children?: ReactNode
}

const Provider = observer(function Provider ({ children }: { children?: ReactNode }): ReactNode {
  const $state = $({ order: [], nodes: {} })
  return pug`
    PortalContext.Provider(value=$state)
      = children
      Host($state=$state)
  `
})

const Host = observer(function Host ({ $state }: { $state: any }): ReactNode {
  const { order, nodes } = $state.get()

  return pug`
    each componentId in order
      Fragment(key=componentId)
        = nodes[componentId]?.()
  `
})

function Portal ({ children }: PortalProps): ReactNode {
  const componentId = useId()
  const $state = useContext(PortalContext)
  if (!$state) throw Error('Portal must be used within a Portal.Provider')

  useEffect(() => {
    $state.nodes[componentId].set(() => children)
    const { $order } = $state
    if (!$order.get().includes(componentId)) $order.push(componentId)
  }, [$state, componentId, children])

  useEffect(() => {
    return () => {
      $state.nodes[componentId].del()
      const { $order } = $state
      const index = $order.get().indexOf(componentId)
      $order[index].del()
    }
  }, [$state, componentId])

  return null
}

const ObservedPortal: any = observer(Portal)

ObservedPortal.Provider = Provider

export default ObservedPortal
