import { useEffect, useState, type ReactNode } from 'react'
import { pug, observer } from 'startupjs'
import Modal from '@startupjs-ui/modal'
import { setUpdateDialogState } from './helpers'

export const _PropsJsonSchema = {/* DialogsProviderProps */}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DialogsProviderProps {}

function DialogsProviderRoot (): ReactNode {
  const [dialog = {}, setDialog] = useState<any>()

  // used by alert/confirm/prompt to show a dialog
  setUpdateDialogState(setDialog)

  useEffect(() => {
    return () => {
      setUpdateDialogState(undefined)
    }
  }, [])

  return pug`
    if dialog.visible
      Modal(
        ...dialog
        visible=!!dialog.visible
        onRequestClose=() => { setDialog(undefined) }
      )= dialog.children
  `
}

export default observer(DialogsProviderRoot) as any
