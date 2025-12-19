import { type ModalProps } from '@startupjs-ui/modal'

export type UpdateDialogState = (dialog?: any) => void

export let updateDialogState: UpdateDialogState | undefined

export const setUpdateDialogState = (fn?: UpdateDialogState): void => {
  updateDialogState = fn
}

export type OpenDialogOptions = Omit<ModalProps, 'visible' | '$visible' | 'ref'>

export const openDialog = (options: OpenDialogOptions): void => {
  if (!updateDialogState) {
    throw Error(
      '[@startupjs-ui/dialogs] dialogs: DialogsProvider is not mounted. ' +
      'Render <DialogsProvider /> once in your app (usually in _layout) as a sibling after your main content.'
    )
  }
  updateDialogState({ visible: true, ...options })
}
