import { useRef, useImperativeHandle, type ReactNode, type RefObject } from 'react'
import { ColorPicker as RNColorPicker } from 'react-native-color-picker'
import { css, pug, observer, $ } from 'startupjs'
import ScrollView from '@startupjs-ui/scroll-view'
import Modal from '@startupjs-ui/modal'

interface PickerProps {
  onChangeColor?: (color: string) => void
  ref?: RefObject<any>
}

function FullHeightScrollView (props: any): ReactNode {
  return pug`
    ScrollView(
      contentContainerStyleName='content'
      ...props
    )
  `
}

function Picker ({
  onChangeColor = () => {},
  ref
}: PickerProps): ReactNode {
  const $visible = useRef<any>($()).current

  useImperativeHandle(ref, () => ({
    show: () => $visible.set(true),
    hide: () => $visible.set(false)
  }))

  return pug`
    Modal($visible=$visible variant='fullscreen')
      Modal.Content(ContentComponent=FullHeightScrollView)
        RNColorPicker.picker(
          onColorSelected=color => {
            onChangeColor(color)
            $visible.set(false)
          }
        )
  `
}

export default observer(Picker)

css`
  .content {
    flex-grow: 1;
    justify-content: center;
  }

  .picker {
    /*
      react-native-color-picker has unusual sizing and positioning logic.
      Keep an explicit height until the upstream picker can size itself correctly.
    */
    height: var(--ColorPicker-picker-height);
  }
`
