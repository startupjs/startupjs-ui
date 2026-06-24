import React, { useMemo, useState } from 'react'
import { css, pug, observer, $, useId, themed } from 'startupjs'

import Button from '@startupjs-ui/button'
import Div from '@startupjs-ui/div'
import ScrollView from '@startupjs-ui/scroll-view'
import Constructor from './Constructor'
import Renderer from './Renderer'

function useEntries ({ Component, props, extraParams, propsJsonSchema }) {
  return useMemo(() => {
    if (!propsJsonSchema?.properties) return []
    const entries = Object.entries(propsJsonSchema.properties)

    const res = parseEntries(entries)
      .filter(entry => entry.name[0] !== '_') // skip private properties

    for (const key in props) {
      const item = res.find(item => item.name === key)
      if (item) {
        item.value = props[key]
      } else {
        res.push({
          name: key,
          type: typeof props[key],
          value: props[key]
        })
      }
    }

    for (const key in extraParams) {
      const item = res.find(item => item.name === key)
      if (item) item.extraParams = extraParams[key]
    }

    return res
  }, [extraParams, props, propsJsonSchema])
}

function parseEntries (entries) {
  return entries.map(entry => {
    const name = entry[0]
    const meta = entry[1]
    let type = meta.type
    if (meta.enum) type = 'oneOf'
    if (meta.$comment && meta.$comment.startsWith('(')) type = 'function'
    if (!type) type = 'any'
    let extendedFrom = meta.extendedFrom
    // children prop is special, it should not be marked as extendedFrom
    if (name === 'children') extendedFrom = undefined
    return {
      name,
      type,
      defaultValue: meta.default,
      possibleValues: meta.enum,
      isRequired: meta.required,
      description: meta.description,
      extendedFrom
    }
  })
}

function useInitDefaultProps ({ entries, $theProps }) {
  if ($theProps.get()) return
  $theProps.set({})

  for (const { name, value, defaultValue } of entries) {
    // When accessing property which starts with '$' it gets removed by Signal's Proxy
    // that's why we need to add an extra '$' at the beginning to access the original name
    const $prop = name.startsWith('$') ? $theProps['$' + name] : $theProps[name]
    if (value !== undefined) {
      $prop.set(value)
    } else if (defaultValue !== undefined) {
      $prop.set(defaultValue)
    }
  }
}

export default observer(themed('PropsComponent', function PComponent ({
  style,
  rendererStyle,
  Component,
  $props,
  props,
  propsJsonSchema,
  extraParams,
  componentName,
  showGrid,
  validateWidth,
  showSizes,
  noScroll,
  block: defaultBlock
}) {
  const [block, setBlock] = useState(!!defaultBlock)
  const componentId = useId()

  const $theProps = useMemo(() => {
    if (!$props) {
      return $.session.Props[componentId]
    } else {
      return $props
    }
  }, [$props, componentId])

  const entries = useEntries({ Component, props, extraParams, propsJsonSchema })
  useInitDefaultProps({ entries, $theProps })

  function Wrapper ({ children }) {
    if (noScroll) {
      return pug`
        Div.scroll.scrollContent
          = children
      `
    }

    return pug`
      ScrollView.scroll(
        horizontal
      )= children
    `
  }

  return pug`
    Div.root(style=style)
      Div.top
        Constructor(
          Component=Component
          extendedFrom=propsJsonSchema?.extendedFrom
          $props=$theProps
          entries=entries
        )

      Div.bottom
        Wrapper
          Renderer(
            style=rendererStyle
            Component=Component
            props=$theProps.get()
            showGrid=showGrid
            validateWidth=validateWidth
            showSizes=showSizes
            block=block
          )
        Div.display(align='right' row)
          Button(
            size='s'
            variant='ghost'
            color=block ? undefined : 'primary'
            onPress=() => setBlock(false)
          ) inline
          Button(
            size='s'
            variant='ghost'
            color=block ? 'primary' : undefined
            onPress=() => setBlock(true)
          ) block
  `
}))

css`
  .root {
    margin-top: 1rem;
  }

  .top {
    background-color: var(--color-bg-main);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    padding-top: 0.5rem;
  }

  .bottom {
    padding-top: 2rem;
    background-color: var(--color-bg-main-subtle);
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }

  .scroll {
    padding-bottom: 1rem;
  }

  .scroll.scrollContent {
    flex-direction: column;
    flex-grow: 1;
    padding: 0 1rem;
  }

  .scroll:part(contentContainer) {
    flex-direction: column;
    flex-grow: 1;
    padding: 0 1rem;
  }

  .display {
    margin: 0.25rem 1rem;
  }
`
