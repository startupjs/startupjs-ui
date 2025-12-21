import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Button from '@startupjs-ui/button'
import Input from '@startupjs-ui/input'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import './index.cssx.styl'

export default observer(
  themed('ArrayInput', ArrayInput)
)

export const _PropsJsonSchema = {/* ArrayInputProps */}

export interface ArrayInputProps {
  /** Custom styles for the wrapper */
  style?: StyleProp<ViewStyle>
  /** Custom styles for the inner input container */
  inputStyle?: StyleProp<ViewStyle>
  /** Model binding for array values */
  $value: any
  /** Input metadata for array items (must include `input` or `type`) */
  items: Record<string, any>
  /** Custom wrapper renderer (used by Input layout wrappers) */
  _renderWrapper?: (style: any, children: ReactNode) => ReactNode
  [key: string]: any
}

function ArrayInput ({
  style,
  inputStyle,
  $value,
  items,
  _renderWrapper
}: ArrayInputProps): ReactNode {
  if (!$value || !items) return null
  console.log('ArrayInput render', { $value, items })

  const arrayLength = $value.get()?.length || 0

  function getInputs () {
    return Array(arrayLength + 1).fill(null).map((_, index) => {
      return {
        ...items,
        key: index,
        $value: $value[index]
      }
    })
  }

  const inputs = getInputs()

  if (!_renderWrapper) {
    _renderWrapper = (style, children): ReactNode => {
      return pug`
        Div(style=style)= children
      `
    }
  }

  // TODO: Instead of just a delete icon, make a three dots menu with things like:
  //         - delete
  //         - move up
  //         - move down
  //         - add new item before
  //         - add new item after
  return _renderWrapper({
    style: [style, inputStyle]
  }, pug`
    each input, index in inputs
      Div.item(key=index styleName={ pushTop: index !== 0 })
        Div.input
          Input(...input)
        Div.actions(vAlign='center' align='right')
          if index < arrayLength
            Button.remove(
              tabIndex=-1
              size='s'
              variant='text'
              icon=faTimes
              onPress=() => $value[index].del()
              color='text-subtle'
            )
  `)
}
