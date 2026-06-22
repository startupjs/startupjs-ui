import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, themed } from 'startupjs'
import { type UIRole } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Button from '@startupjs-ui/button'
import Input from '@startupjs-ui/input'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import './index.cssx.styl'

type ArrayInputWrapperProps = {
  style?: any
  testID?: string
  id?: string
  role?: UIRole
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-errormessage'?: string
  'aria-invalid'?: boolean
  'aria-required'?: boolean
  'aria-disabled'?: boolean
  'aria-readonly'?: boolean
}

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
  _renderWrapper?: (params: ArrayInputWrapperProps, children: ReactNode) => ReactNode
  /** Test identifier */
  testID?: string
  /** Web id for the wrapper */
  id?: string
  /** ARIA role for the wrapper */
  role?: UIRole
  /** Accessible name for the wrapper */
  'aria-label'?: string
  /** Id of the element that labels the wrapper */
  'aria-labelledby'?: string
  /** Id of the element that describes the wrapper */
  'aria-describedby'?: string
  /** Id of the element that describes the wrapper error */
  'aria-errormessage'?: string
  /** Invalid state for the wrapper */
  'aria-invalid'?: boolean
  /** Required state for the wrapper */
  'aria-required'?: boolean
  /** Disabled state for the wrapper */
  'aria-disabled'?: boolean
  /** Readonly state for the wrapper */
  'aria-readonly'?: boolean
  [key: string]: any
}

function ArrayInput ({
  style,
  inputStyle,
  $value,
  items,
  _renderWrapper,
  testID,
  id,
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-errormessage': ariaErrorMessage,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  'aria-disabled': ariaDisabled,
  'aria-readonly': ariaReadonly
}: ArrayInputProps): ReactNode {
  if (!$value || !items) return null

  const arrayLength = $value.get()?.length || 0

  function getInputs () {
    return Array(arrayLength + 1).fill(null).map((_, index) => {
      return {
        ...items,
        $value: $value[index]
      }
    })
  }

  const inputs = getInputs()

  if (!_renderWrapper) {
    _renderWrapper = ({
      style,
      testID,
      id,
      role,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-errormessage': ariaErrorMessage,
      'aria-invalid': ariaInvalid,
      'aria-required': ariaRequired,
      'aria-disabled': ariaDisabled,
      'aria-readonly': ariaReadonly
    }, children): ReactNode => {
      return pug`
        Div(
          style=style
          testID=testID
          id=id
          role=role
          aria-label=ariaLabel
          aria-labelledby=ariaLabelledBy
          aria-describedby=ariaDescribedBy
          aria-errormessage=ariaErrorMessage
          aria-invalid=ariaInvalid
          aria-required=ariaRequired
          aria-disabled=ariaDisabled
          aria-readonly=ariaReadonly
        )= children
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
    style: [style, inputStyle],
    testID,
    id,
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
    'aria-disabled': ariaDisabled,
    'aria-readonly': ariaReadonly
  }, pug`
    each inputProps, index in inputs
      Div.item(key=index styleName={ pushTop: index !== 0 })
        Div.input
          Input(...inputProps)
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
