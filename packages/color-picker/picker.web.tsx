import { useRef, useEffect, useImperativeHandle, type ReactNode, type RefObject } from 'react'
import { pug, observer } from 'startupjs'

interface PickerProps {
  onChangeColor?: (color: string) => void
  ref?: RefObject<any>
}

function Picker ({
  onChangeColor = () => {},
  ref
}: PickerProps): ReactNode {
  const pickerRef = useRef<any>(null)

  useImperativeHandle(ref, () => ({
    show: () => pickerRef.current?.click?.(),
    hide: () => {
      // hacky way to close the color picker
      if (!pickerRef.current) return
      pickerRef.current.setAttribute('type', 'text')
      pickerRef.current.setAttribute('type', 'color')
    }
  }))

  function onChange (e: any) {
    onChangeColor(e.target.value)
  }

  useEffect(() => {
    const colorPicker = pickerRef.current
    if (!colorPicker) return
    colorPicker.addEventListener('change', onChange, false)
    return () => colorPicker.removeEventListener('change', onChange, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return pug`
    input(
      ref=pickerRef
      type='color'
      style={
        visibility: 'hidden',
        position: 'absolute',
        alignSelf: 'center'
      }
    )
  `
}

export default observer(Picker)
