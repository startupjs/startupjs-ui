import { useEffect, useState, type ReactNode, type RefObject } from 'react'
import { Text } from 'react-native'
import { pug, styl, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle'
import merge from 'lodash/merge'
import useLayout from './useLayout'

export const IS_WRAPPED = Symbol('wrapped into wrapInput()')

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
  configuration = merge(
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

    configuration = merge(configuration, componentConfiguration)
    configuration = merge(configuration, configuration[currentLayout])

    const {
      labelPosition,
      descriptionPosition,
      isLabelColoredWhenFocusing,
      isLabelClickable
    } = configuration

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

    const _label = pug`
      if label
        Span.label(
          key='label'
          part='label'
          styleName=[
            currentLayout,
            currentLayout + '-' + labelPosition,
            {
              focused: isLabelColoredWhenFocusing ? focused : false,
              error: hasError
            }
          ]
          onPress=isLabelClickable
            ? _onLabelPress
            : undefined
        )
          = label
          if required === true
            Text.required= ' *'
    `
    const _description = pug`
      if description
        Span.description(
          key='description'
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

    if (label && props.accessibilityLabel == null) {
      inputAccessibilityProps.accessibilityLabel = label
    }

    if (description && props.accessibilityHint == null) {
      inputAccessibilityProps.accessibilityHint = description
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
        each _error, index in (Array.isArray(error) ? error : [error])
          Div.errorContainer(
            key='error-' + index
            styleName=[
              currentLayout,
              currentLayout + '-' + descriptionPosition,
            ]
            vAlign='center'
            row
          )
            Icon.errorContainer-icon(icon=faExclamationCircle)
            Span.errorContainer-text= _error
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
