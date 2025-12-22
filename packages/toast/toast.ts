import { $ } from 'startupjs'
import { $toasts } from './helpers'
import { type ToastProps } from './ToastView'

const MAX_SHOW_LENGTH = 3

export const _PropsJsonSchema = {/* ToastOptions */}

export interface ToastOptions {
  /** Prevents auto-close after 5 seconds */
  alert?: boolean
  /** Custom icon shown next to the title */
  icon?: ToastProps['icon']
  /** Body text displayed under the title */
  text?: string
  /** Visual style variant @default 'info' */
  type?: ToastProps['type']
  /** Title text displayed in the header */
  title?: string
  /** Action button label displayed below the text @default 'View' */
  actionLabel?: string
  /** Action button press handler */
  onAction?: () => void
  /** Called after the toast is closed and removed */
  onClose?: () => void
}

type ToastStackItem = ToastProps & {
  key: string
  alert?: boolean
}

// NOTE
// Is this the best way to update position of toasts?
// Is there a better way to do this?
// We want to remove unnecessary props from toast
// component that are added by these calculations.
const updateMatrixPositions = () => {
  const toasts = $toasts.get() as ToastStackItem[]

  const updateToasts = toasts.map((toast, index) => {
    const prevToast = toasts[index - 1]

    if (prevToast) {
      const prevHeight = prevToast.height ?? 0
      toast.topPosition = prevToast.topPosition + prevHeight
    } else {
      toast.topPosition = 0
    }

    return toast
  })

  $toasts.set(updateToasts)
}

export default function toast ({
  alert,
  icon,
  text,
  type,
  title,
  actionLabel,
  onAction,
  onClose
}: ToastOptions): void {
  const toastId = $.id() as string

  if ($toasts.get()?.length === MAX_SHOW_LENGTH) {
    $toasts[MAX_SHOW_LENGTH - 1].show.set(false)
  }

  if (!alert) {
    setTimeout(() => {
      const index = getValidIndex()
      if (index !== -1) $toasts[index].show.set(false)
    }, 5000)
  }

  function onRemove () {
    const index = getValidIndex()
    if (index === -1) return

    $toasts[index].del()
    updateMatrixPositions()
    onClose && onClose()
  }

  // toastId ensures that the correct index is found at the current moment
  function getValidIndex () {
    const toasts = $toasts.get() as ToastStackItem[]
    return toasts.findIndex(toast => toast.key === toastId)
  }

  // NOTE
  // Think about using context instead of model
  // We can provide registerToast function in context
  // Which will be better? model or context?
  function onLayout (layout: { height: number }) {
    $toasts[getValidIndex()].height.set(layout.height)
    updateMatrixPositions()
  }

  const newToast: ToastStackItem = {
    key: toastId,
    show: true,
    topPosition: 0,
    alert,
    icon,
    type,
    text,
    title,
    actionLabel,
    onAction,
    onClose: onRemove,
    onLayout
  }

  // TODO: The current implementation modifies the toast data directly, which violates the immutability principle of the model.
  // This works only because the data is local, but it's a hacky solution.
  // We should implement an .unshift() method on the Signal to handle this correctly in the future.
  // For now, this serves as a quick fix, but we need to address this properly to ensure data immutability.

  const toasts = $toasts.get() || []
  toasts.unshift(newToast)
  $toasts.set(toasts)
}
