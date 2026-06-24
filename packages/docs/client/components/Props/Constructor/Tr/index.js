import React from 'react'
import { css, pug, observer, themed } from 'startupjs'

import Div from '@startupjs-ui/div'

export default observer(themed('DocsTr', function Tr ({ children, style }) {
  return pug`
    Div.root(style=style)= children
  `
}))

css`
  .root {
    flex-direction: row;
    border-color: var(--color-border-main);
    border-bottom-width: 1px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
`
