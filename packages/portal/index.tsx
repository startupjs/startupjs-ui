import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import { observer } from 'startupjs'

interface PortalEntry {
  id: string
  render: () => ReactNode
}

interface PortalManager {
  mount: (id: string, render: () => ReactNode) => void
  unmount: (id: string) => void
}

const PortalContext = createContext<PortalManager | undefined>(undefined)

export const _PropsJsonSchema = {/* PortalProps */}

export interface PortalProps {
  /** Content rendered into the portal host */
  children?: ReactNode
}

function Provider ({ children }: { children?: ReactNode }): ReactNode {
  const [entries, setEntries] = useState<PortalEntry[]>([])

  const mount = useCallback((id: string, render: () => ReactNode) => {
    setEntries(entries => {
      const index = entries.findIndex(entry => entry.id === id)
      if (index === -1) return [...entries, { id, render }]

      const next = entries.slice()
      next[index] = { id, render }
      return next
    })
  }, [])

  const unmount = useCallback((id: string) => {
    setEntries(entries => entries.filter(entry => entry.id !== id))
  }, [])

  const value = useMemo(() => ({ mount, unmount }), [mount, unmount])

  return (
    <PortalContext.Provider value={value}>
      {children}
      {entries.map(entry => (
        <Fragment key={entry.id}>
          {entry.render()}
        </Fragment>
      ))}
    </PortalContext.Provider>
  )
}

function Portal ({ children }: PortalProps): ReactNode {
  const componentId = useId()
  const portal = useContext(PortalContext)
  if (!portal) throw Error('Portal must be used within a Portal.Provider')

  useEffect(() => {
    portal.mount(componentId, () => children)
    return () => { portal.unmount(componentId) }
  }, [portal, componentId, children])

  return null
}

const ObservedPortal: any = observer(Portal)

ObservedPortal.Provider = Provider

export default ObservedPortal
