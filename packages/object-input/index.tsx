import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'
import { type UIRole } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Input from '@startupjs-ui/input'

type ObjectInputWrapperProps = {
  style: StyleProp<ViewStyle> | undefined
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
  themed('ObjectInput', ObjectInput)
)
const ROOT_STYLE: ViewStyle = {
  width: '100%'
}

export const _PropsJsonSchema = {/* ObjectInputProps */}

export interface ObjectInputProps {
  /** Custom styles for the wrapper */
  style?: StyleProp<ViewStyle>
  /** Custom styles for the inner input container */
  inputStyle?: StyleProp<ViewStyle>
  /** Model binding for object values */
  $value: any
  /** Error messages keyed by property name @default {} */
  errors?: Record<string, any>
  /** Input metadata keyed by property name */
  properties: Record<string, any>
  /** Order of rendered inputs */
  order?: string[]
  /** Render inputs in a row */
  row?: boolean
  /** Disable interactions */
  disabled?: boolean
  /** Render as read-only */
  readonly?: boolean
  /** Custom wrapper renderer (used by Input layout wrappers) */
  _renderWrapper?: (params: ObjectInputWrapperProps, children: ReactNode) => ReactNode
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
  /** Additional props */
  [key: string]: any
}

function ObjectInput ({
  style,
  inputStyle,
  $value,
  errors = {},
  properties,
  order,
  row,
  disabled,
  readonly,
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
}: ObjectInputProps): ReactNode {
  if (!$value || !properties) {
    return null
  }

  const value = $value.get() || {}

  const resolvedOrder = getOrder(order, properties)

  function getInputs () {
    return resolvedOrder
      .filter((key) => {
        const { dependsOn, dependsValue } = properties[key]
        return resolvesDeps(value, dependsOn, dependsValue)
      })
      .map((key) => {
        const { dependsOn, dependsValue, ...inputProps } = properties[key]
        return {
          ...inputProps,
          key,
          $value: $value[key]
        }
      // TODO: When the dependsOn field changes and this field is no longer visible -- clear it.
      }).filter(Boolean)
  }

  const inputs = getInputs()

  if (inputs.length === 0) return null

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
        Div.root(
          part='root'
          style=[ROOT_STYLE, style]
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
          row=row
        )= children
      `
    }
  }

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
  }, inputs.map(({ key, ...inputProps }, index): ReactNode => pug`
    Input.input(
      part='input'
      key=key
      styleName={ push: index !== 0, row, column: !row }
      error=errors[key]
      disabled=disabled
      readonly=readonly
      ...inputProps
    )
  `))
}

css`
  .input.row {
    flex: 1;
  }

  .input.push.column {
    margin-top: var(--ObjectInput-column-gap);
  }

  .input.push.row {
    margin-left: var(--ObjectInput-row-gap);
  }
`

function getOrder (order: string[] | undefined, properties: Record<string, any>): string[] {
  return order ?? Object.keys(properties)
}

function resolvesDeps (
  value: Record<string, any> = {},
  dependsOn?: string,
  dependsValue?: any
): boolean {
  if (!dependsOn) return true
  const dependencyValue = value[dependsOn]
  return (
    (dependsValue != null && dependencyValue === dependsValue) ||
    (dependsValue != null && Array.isArray(dependsValue) &&
      dependsValue.includes(dependencyValue)
    ) ||
    (
      (dependsValue == null || (typeof dependsValue === 'string' && dependsValue.trim() === '')) &&
      dependencyValue != null &&
      !(typeof dependencyValue === 'string' && dependencyValue.trim() === '')
    )
  )
}
