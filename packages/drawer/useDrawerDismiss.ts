import { useEffect, useState } from 'react'

interface DrawerDismissState {
  tag: string
  data: any
}

export interface DrawerDismissCallbacks {
  default: (data?: any) => void
  [tag: string]: ((data?: any) => void) | any
}

export default function useDrawerDismiss (
  callbacks: DrawerDismissCallbacks
): [
    onDismiss: () => void,
    setOnDismiss: (tag: string, data?: any) => void
  ] {
  const [state, setState] = useState<DrawerDismissState>({ tag: 'default', data: null })

  useEffect(() => {
    if (state.tag !== 'default') {
      callbacks.default()
    }
    // preserve legacy behavior (no dependency array)
  })

  return [
    () => {
      callbacks[state.tag]?.(state.data)
      setState({ tag: 'default', data: null })
    },
    (tag, data) => { setState({ tag, data }) }
  ]
}
