import React from 'react'
import { css, pug, observer } from 'startupjs'
import Div from '@startupjs-ui/div'

export default observer(function Td ({ children, style }) {
  return pug`
    Div.root(style=style)= children
  `
})

css`
  .root {
    flex: 1;
    justify-content: center;
    padding: 0.5rem;
  }
`
