import { useEffect, useState, type ReactNode, type RefObject } from 'react'
import { Platform, Text, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle'
import merge from 'lodash/merge'
import getInputTestId from './helpers/getInputTestId'
import useLayout from './useLayout'

export const IS_WRAPPED = Symbol('wrapped into wrapInput()')
const IS_WEB = Platform.OS === 'web'
const ROOT_STYLE: ViewStyle = {
  width: '100%'
}

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
      description
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
        Text.required(aria-hidden)= ' *'
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
      if (label) inputAccessibilityProps['aria-label'] = label
    }

    if (inputId) {
      inputAccessibilityProps.id = inputId
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
        style=ROOT_STYLE
        styleName=[currentLayout]
        row=currentLayout === 'columns'
        vAlign=currentLayout === 'columns' ? 'center' : undefined
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

css`
  .label {
    color: var(--InputWrapper-label-color);
    align-self: flex-start;
    font-size: var(--InputWrapper-label-font-size);
    line-height: var(--InputWrapper-label-line-height);
  }

  .label.focused {
    color: var(--InputWrapper-focused-color);
  }

  .label.error {
    color: var(--InputWrapper-error-color);
  }

  .description {
    font-size: var(--InputWrapper-description-font-size);
    line-height: var(--InputWrapper-description-line-height);
  }

  .required {
    color: var(--InputWrapper-error-color);
    font-weight: var(--font-weight-bold);
  }

  .errorContainer {
    margin-top: var(--InputWrapper-error-margin-top);
    margin-bottom: var(--InputWrapper-error-margin-bottom);
  }

  .errorContainer-icon {
    color: var(--InputWrapper-error-color);
  }

  .errorContainer-text {
    font-size: var(--InputWrapper-description-font-size);
    line-height: var(--InputWrapper-description-line-height);
    margin-left: var(--InputWrapper-error-text-gap);
    color: var(--InputWrapper-error-color);
  }

  .label.rows-top {
    margin-bottom: var(--InputWrapper-label-gap);
  }

  .description.rows-top {
    margin-bottom: var(--InputWrapper-description-gap);
  }

  .errorContainer.rows-top {
    margin-top: 0;
    margin-bottom: var(--InputWrapper-description-gap);
  }

  .label.rows-right {
    margin-left: var(--InputWrapper-label-gap-inline);
  }

  .description.rows-bottom {
    margin-top: var(--InputWrapper-label-gap);
  }

  .leftBlock,
  .rightBlock {
    flex: 1;
  }

  .leftBlock {
    margin-right: var(--InputWrapper-column-gap);
  }

  .rightBlock {
    margin-left: var(--InputWrapper-column-gap);
  }

`
