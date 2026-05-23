import { useMemo, useCallback, useState, useId, useRef, type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, $ } from 'startupjs'
import ObjectInput from '@startupjs-ui/object-input'
import { CustomInputsContext } from '@startupjs-ui/input'
import _debounce from 'lodash/debounce'
import { FormPropsContext } from './useFormProps'
import { Validator } from './useValidate'

export const _PropsJsonSchema = {/* FormProps */}

export interface FormProps {
  /** Schema describing form fields (json-schema compatible) */
  fields?: Record<string, any>
  /** Reactive schema (overrides `fields`) */
  $fields?: any
  /** Reactive errors model (managed by validation) */
  $errors?: any
  /** Styles for the wrapper */
  style?: StyleProp<ViewStyle>
  /** Styles for the inner input container */
  inputStyle?: StyleProp<ViewStyle>
  /** Order of rendered fields */
  order?: string[]
  /** Render inputs in a row */
  row?: boolean
  /** Explicit errors object (overrides `$errors`) */
  errors?: Record<string, any>
  /** Custom inputs by type key */
  customInputs?: Record<string, any>
  /** Custom wrapper renderer for inputs */
  _renderWrapper?: (params: { style: StyleProp<ViewStyle> | undefined }, children: ReactNode) => ReactNode
  /** Enable validation or pass validate hook from useValidate */
  validate?: boolean | any
  /** Disable interactions */
  disabled?: boolean
  /** Render as read-only */
  readonly?: boolean
  /** Test identifier */
  testID?: string
  /** Model binding for form values */
  $value: any
  /** Do not use; pass `fields` instead (will throw if set) */
  properties?: Record<string, any>
  /** Additional props passed to custom inputs via `useFormProps` */
  [key: string]: any
}

function Form ({
  fields = {},
  $fields,
  $errors,
  properties,
  order,
  row,
  errors,
  _renderWrapper,
  validate,
  style,
  inputStyle,
  customInputs = {},
  ...props
}: FormProps): ReactNode {
  if (properties) throw Error(ERROR_PROPERTIES)
  const { disabled, readonly, $value } = props
  if (!$value) throw Error('<Form />: $value prop is required')

  const formId = useId()
  const forceUpdate = useForceUpdate()

  const memoizedFields = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => fields, [JSON.stringify(fields)]
  )

  if (!$errors) $errors = $()
  const validator = useMemo(() => new Validator(), [])

  useMemo(() => {
    validator.init({
      fields: $fields?.get() || memoizedFields,
      getValue: () => $value.get(),
      $errors,
      forceUpdate,
      formId
    })
  }, [JSON.stringify(memoizedFields), $fields, $value, $errors, forceUpdate, formId]) // eslint-disable-line react-hooks/exhaustive-deps

  const memoizedProps = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => props, [...Object.keys(props), ...Object.values(props)]
  )

  const memoizedCustomInputs = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => customInputs, [...Object.keys(customInputs), ...Object.values(customInputs)]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedValidate = useCallback(
    _debounce(() => validator.run(), 30, { leading: false, trailing: true }),
    [validator]
  )

  // TODO: $(fn, triggerFn)
  // $(() => JSON.stringify($value.get()), debouncedValidate)
  useRef<any>($(() => {
    JSON.stringify($value.get())
    debouncedValidate()
  }))

  useMemo(() => {
    // if validate prop is set, trigger validation right away on mount.
    if (validate === true) {
      validator.activate()
      validator.run()
    } else if (typeof validate === 'function') {
      validate.reset()
      validate.init({ validator, formId })
      if (validate.always) {
        validator.activate()
        validator.run()
      }
      // when Form is unmounted, reset the parent's validate
      return () => validate.reset({ formId })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return pug`
    FormPropsContext.Provider(value=memoizedProps)
      CustomInputsContext.Provider(value=memoizedCustomInputs)
        ObjectInput(
          properties=$fields?.get() || memoizedFields
          $value=$value
          order=order
          row=row
          errors=errors || $errors.get()
          style=style
          inputStyle=inputStyle
          testID=props.testID
          _renderWrapper=_renderWrapper
          disabled=disabled
          readonly=readonly
        )
  `
}

export default observer(Form)

export { default as useFormProps } from './useFormProps'
export { default as useValidate } from './useValidate'
export { default as useFormFields } from './useFormFields'
export { default as useFormFields$ } from './useFormFields$'

function useForceUpdate (): () => void {
  const [, setState] = useState(Math.random())
  return useCallback(() => {
    setState(Math.random())
  }, [])
}

const ERROR_PROPERTIES = `
  Form: 'properties' prop can only be used directly in ObjectInput.
        Use 'fields' instead
`
