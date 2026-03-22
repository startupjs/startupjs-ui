import { useEffect, useState, type ReactNode, type RefObject } from 'react'
import { Platform, Text } from 'react-native'
import { pug, styl, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle'
import merge from 'lodash/merge'
import getInputTestId from './helpers/getInputTestId'
import useLayout from './useLayout'

export const IS_WRAPPED = Symbol('wrapped into wrapInput()')
const IS_WEB = Platform.OS === 'web'

export type InputLayout = 'pure' | 'rows' | 'columns'

export interface InputWrapperLayoutConfiguration {
  labelPosition?: 'top' | 'right'
  descriptionPosition?: 'top' | 'bottom'
  _renderWrapper?: any
  [key: string]: any
}

export interface InputWrapperConfiguration extends InputWrapperLayoutConfiguration {
  rows?: InputWrapperLayoutConfiguration
  columns?: InputWrapperLayoutConfiguration
  isLabelColoredWhenFocusing?: boolean
  isLabelClickable?: boolean
  _webLabelMode?: 'aria' | 'native'
}

export interface InputWrapperProps {
  label?: string
  description?: string
  layout?: InputLayout
  configuration?: InputWrapperConfiguration
  error?: string | string[]
  required?: boolean | object
  disabled?: boolean
  readonly?: boolean
  onFocus?: (...args: any[]) => void
  onBlur?: (...args: any[]) => void
  _onLabelPress?: () => void
  ref?: RefObject<any>
  style?: any
  [key: string]: any
}

export function isWrapped (Component: any): boolean {
  return Component[IS_WRAPPED]
}

export default function wrapInput (Component: any, configuration: InputWrapperConfiguration = {}): any {
  const defaultConfiguration = merge(
    {
      rows: {
        labelPosition: 'top',
        descriptionPosition: 'top'
      },
      isLabelColoredWhenFocusing: false,
      isLabelClickable: false
    },
    configuration
  )

  function InputWrapper ({
    label,
    description,
    layout,
    configuration: componentConfiguration,
    error,
    onFocus,
    required,
    onBlur,
    _onLabelPress,
    ref,
    ...props
  }: InputWrapperProps): ReactNode {
    const currentLayout = useLayout({
      layout,
      label,
      description
    })

    const mergedConfiguration = merge({}, defaultConfiguration, componentConfiguration)
    const resolvedConfiguration = merge({}, mergedConfiguration, mergedConfiguration[currentLayout])

    const {
      labelPosition,
      descriptionPosition,
      isLabelColoredWhenFocusing,
      isLabelClickable,
      _webLabelMode = 'aria'
    } = resolvedConfiguration

    const [focused, setFocused] = useState(false)
    const isReadOnlyOrDisabled = [props.readonly, props.disabled].some(Boolean)

    function handleFocus (...args: any[]) {
      setFocused(true)
      onFocus && onFocus(...args)
    }

    function handleBlur (...args: any[]) {
      setFocused(false)
      onBlur && onBlur(...args)
    }

    // NOTE
    useEffect(() => {
      if (!isLabelColoredWhenFocusing) return
      if (focused && isReadOnlyOrDisabled) setFocused(false)
    }, [focused, isLabelColoredWhenFocusing, isReadOnlyOrDisabled])

    const hasError = Array.isArray(error) ? error.length > 0 : !!error
    const generatedTestID = props.testID ?? getInputTestId({
      ...props,
      label,
      description,
      testId: props.testID
    })
    const semanticBaseId = typeof generatedTestID === 'string' && generatedTestID !== ''
      ? generatedTestID
      : undefined
    const inputId = semanticBaseId ? `${semanticBaseId}-input` : undefined
    const labelId = label && semanticBaseId ? `${semanticBaseId}-label` : undefined
    const descriptionId = description && semanticBaseId ? `${semanticBaseId}-description` : undefined
    const errorId = hasError && semanticBaseId ? `${semanticBaseId}-error` : undefined
    const useNativeWebLabel = IS_WEB && _webLabelMode === 'native' && !!inputId

    const labelStyleName = [
      currentLayout,
      currentLayout + '-' + labelPosition,
      {
        focused: isLabelColoredWhenFocusing ? focused : false,
        error: hasError
      }
    ]
    const requiredAsterisk = required === true
      ? pug`
        Text.required(aria-hidden=IS_WEB ? true : undefined)= ' *'
      `
      : null
    const WebLabelElement = 'label'
    const _label = label
      ? useNativeWebLabel
        ? pug`
          WebLabelElement.label(
            key='label'
            id=labelId
            htmlFor=inputId
            part='label'
            styleName=labelStyleName
          )
            = label
            = requiredAsterisk
        `
        : pug`
          Span.label(
            key='label'
            id=labelId
            part='label'
            styleName=labelStyleName
            onPress=isLabelClickable
              ? _onLabelPress
              : undefined
          )
            = label
            = requiredAsterisk
        `
      : null
    const _description = pug`
      if description
        Span.description(
          key='description'
          id=descriptionId
          part='description'
          styleName=[
            currentLayout,
            descriptionPosition,
            currentLayout + '-' + descriptionPosition
          ]
          description
        )= description
    `

    const passRef = ref ? { ref } : {}
    const inputAccessibilityProps: Record<string, any> = {}
    const describedBy = [descriptionId].filter(Boolean).join(' ') || undefined

    if (props['aria-label'] == null) {
      if (props.accessibilityLabel != null) inputAccessibilityProps['aria-label'] = props.accessibilityLabel
      else if (label) inputAccessibilityProps['aria-label'] = label
    }

    if (inputId) {
      inputAccessibilityProps.id = inputId
      inputAccessibilityProps.nativeID = inputId
    }
    if (required === true) inputAccessibilityProps['aria-required'] = true
    if (labelId) inputAccessibilityProps['aria-labelledby'] = labelId
    if (describedBy) inputAccessibilityProps['aria-describedby'] = describedBy
    if (hasError && errorId) {
      inputAccessibilityProps['aria-errormessage'] = errorId
      inputAccessibilityProps['aria-invalid'] = true
    }

    const input = pug`
      Component(
        key='input'
        part='wrapper'
        layout=currentLayout
        _hasError=hasError
        onFocus=handleFocus
        onBlur=handleBlur
        ...inputAccessibilityProps
        ...passRef
        ...props
      )
    `
    const err = pug`
      if hasError
        Div.errorContainer(
          key='error'
          id=errorId
          styleName=[
            currentLayout,
            currentLayout + '-' + descriptionPosition,
          ]
          vAlign='center'
          row
        )
          Icon.errorContainer-icon(icon=faExclamationCircle)
          Span.errorContainer-text
            each _error, index in (Array.isArray(error) ? error : [error])
              if index
                Text= ' '
              = _error
    `

    return pug`
      Div.root(
        part='root'
        styleName=[currentLayout]
      )
        if currentLayout === 'rows'
          if labelPosition === 'top'
            = _label
          if descriptionPosition === 'top'
            = _description
            = err
          if labelPosition === 'right'
            Div(vAlign='center' row)
              = input
              = _label
          else
            = input
          if descriptionPosition === 'bottom'
            = err
            = _description
        else if currentLayout === 'columns'
          Div.leftBlock
            = _label
            = _description
          Div.rightBlock
            = input
            = err
        else if currentLayout === 'pure'
          = input
          = err
    `
  }

  const componentDisplayName = Component.displayName ?? Component.name

  InputWrapper.displayName = componentDisplayName + 'InputWrapper'

  const ObservedInputWrapper = observer(
    themed('InputWrapper', InputWrapper)
  ) as any

  ObservedInputWrapper[IS_WRAPPED] = true

  return ObservedInputWrapper
}

styl`
  $errorColor = var(--color-text-error)
  $focusedColor = var(--color-text-primary)

  // common
  .label
    color var(--InputWrapper-label-color)
    align-self flex-start
    font(body2)

    &.focused
      color $focusedColor

    &.error
      color $errorColor

  .description
    font(caption)

  .required
    color $errorColor
    font-weight bold

  .errorContainer
    margin-top 1u
    margin-bottom 0.5u

    &-icon
      color $errorColor

    &-text
      font(caption)
      margin-left 0.5u
      color $errorColor

  // rows
  .rows
    &-top
      .label&
        margin-bottom 0.5u

      .description&
        margin-bottom 1u

      .errorContainer&
        margin-top 0
        margin-bottom 1u

    &-right
      .label&
        margin-left 1u

    &-bottom
      .description&
        margin-top 0.5u

  // columns
  .leftBlock
  .rightBlock
    flex 1

  .leftBlock
    margin-right 1.5u

  .rightBlock
    margin-left 1.5u

  .columns
    .root&
      flex-direction row
      align-items center

`
