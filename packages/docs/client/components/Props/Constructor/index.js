import React from 'react'
import { Platform } from 'react-native'
import { css, pug, observer, $, themed } from 'startupjs'
import Span from '@startupjs-ui/span'
import Tag from '@startupjs-ui/tag'

import Div from '@startupjs-ui/div'
import Table from './Table'
import Tbody from './Tbody'
import Thead from './Thead'
import Tr from './Tr'
import Td from './Td'
import TypeCell from './TypeCell'
import ValueCell from './ValueCell'

export default observer(themed('Constructor', function Constructor ({
  Component,
  extendedFrom,
  entries,
  $props,
  style
}) {
  const $showExtends = $()
  function renderEntry (entry) {
    const { name, type, defaultValue, possibleValues, isRequired } = entry
    return pug`
      Tr(key=name)
        Td
          Span.name(
            style={
              fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace'
            }
          )= name
          if isRequired
            Tag.required(
              variant='outline'
              size='s'
              color='error'
              shape='rounded'
            ) Required
          if defaultValue != null
            Span.valueDefault
              Span(description) =#{' '}
              Span.value= JSON.stringify(defaultValue)
        Td: Span(description italic)= entry.description || '-'
        Td: TypeCell(possibleValues=possibleValues type=type)
        Td.vCenter: ValueCell(entry=entry $props=$props)
    `
  }
  return pug`
    Table.table(style=style)
      Thead.thead
        Tr
          Td: Span.header PROP
          Td: Span.header DESCRIPTION
          Td: Span.header TYPE
          Td: Span.header.right VALUE
      Tbody
        if extendedFrom
          Div.extends
            Div.collapsibleHeader(onPress=() => $showExtends.set(!$showExtends.get()))
              Span(italic style={
                fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace'
              })
                if $showExtends.get()
                  | -#{' '}
                else
                  | +#{' '}
                | Extends component props from#{' '}
                Span(bold)= extendedFrom + ' '
                if $showExtends.get()
                  | (tap to collapse)
                else
                  | (tap to expand)
            if $showExtends.get()
              each entry in entries
                if entry.extendedFrom === extendedFrom
                  = renderEntry(entry)
        each entry in entries
          if !entry.extendedFrom
            = renderEntry(entry)
  `
}))

css`
  .header {
    color: var(--color-text-description);
    font-family: monospace;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .header.right {
    text-align: right;
  }

  .extends {
    border-bottom-width: 2px;
    border-bottom-color: var(--color-border-main);
    background-color: rgba(0, 0, 0, 0.03);
  }

  .collapsibleHeader {
    padding: 0.5rem 0.5rem 0.5rem 1rem;
  }

  .possibleValue {
    flex-direction: row;
  }

  .value {
    color: var(--color-text-success);
    font-style: italic;
  }

  .valueDefault {
    padding-left: 2rem;
  }

  .type {
    color: var(--color-text-info);
    font-style: italic;
  }

  .checkbox {
    align-self: flex-end;
  }

  .unsupported {
    color: var(--color-text-description);
    text-align: right;
  }

  .separator {
    color: var(--color-text-placeholder);
  }

  .vCenter {
    justify-content: center;
  }

  .required {
    margin-top: 0.25rem;
    align-self: flex-start;
  }

  .badJSON {
    color: var(--color-text-error);
  }
`
