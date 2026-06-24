import React from 'react'
import { css, pug, observer } from 'startupjs'
import Div from '@startupjs-ui/div'

export default observer(function Table ({ children, style }) {
  return pug`
    Div.root(style=style)= children
  `
})

css`
  .root {
    width: 100%;
  }
`
