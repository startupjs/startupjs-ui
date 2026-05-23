import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Input from '@startupjs-ui/input'
import './index.cssx.styl'

export default observer(
  themed('ObjectInput', ObjectInput)
)

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
  _renderWrapper?: (params: { style: StyleProp<ViewStyle> | undefined, testID?: string, props?: Record<string, any> }, children: ReactNode) => ReactNode
  /** Test identifier */
  testID?: string
  /** Additional props forwarded to the wrapper */
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
  ...props
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
    _renderWrapper = ({ style, props }, children): ReactNode => {
      return pug`
        Div(style=style testID=testID row=row ...props)= children
      `
    }
  }

  return _renderWrapper({
    style: [style, inputStyle],
    testID,
    props
  }, inputs.map(({ key, ...inputProps }, index): ReactNode => pug`
    Input.input(
      key=key
      styleName={ push: index !== 0, row, column: !row }
      error=errors[key]
      disabled=disabled
      readonly=readonly
      ...inputProps
    )
  `))
}

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
