import React, { useCallback, useMemo } from 'react'
import { css, pug, observer, $, themed } from 'startupjs'
import Button from '@startupjs-ui/button'
import Span from '@startupjs-ui/span'

const MAX_ITEMS = 10

export default observer(themed('TypeCell', function TypeCell ({ possibleValues, theme, type }) {
  const $collapsed = $(true)

  const values = useMemo(() => {
    if (!Array.isArray(possibleValues)) return []
    return $collapsed.get() ? possibleValues.slice(0, MAX_ITEMS) : possibleValues
  }, [$collapsed, possibleValues])

  const toggleList = useCallback(() => {
    $collapsed.set(!$collapsed.get())
  }, [$collapsed])

  const renderButton = useCallback(() => {
    if (possibleValues?.length <= MAX_ITEMS) return null
    return pug`
      Span &nbsp&nbsp
      Button(
        color='primary'
        size='s'
        variant='ghost'
        onPress=toggleList
      )= $collapsed.get() ? 'More...' : 'Less'
    `
  }, [$collapsed, possibleValues, toggleList])

  return pug`
    if type === 'oneOf'
      Span.possibleValue
        each value, index in values
          Span(key=index)
            if index
              Span.separator(styleName=[theme]) #{' | '}
            Span.value(styleName=[theme])= JSON.stringify(value)
        = renderButton()
    else if type === 'oneOfType'
      Span.possibleType
        each value, index in values
          React.Fragment(key=index)
            if index
              Span.separator #{' | '}
            Span.type(styleName=[theme])= value && value.name
        = renderButton()
    else
      Span.type(styleName=[theme])= type
  `
}))

css`
  .possibleValue {
    flex-direction: row;
  }

  .value {
    color: var(--color-text-success);
    font-style: italic;
  }

  .type {
    color: var(--color-text-info);
    font-style: italic;
  }

  .separator {
    color: var(--color-text-placeholder);
  }
`
