import React from 'react'
import { pug, observer, themed } from 'startupjs'

import Div from '@startupjs-ui/div'
import './index.styl'

export default observer(themed('DocsTr', function Tr ({ children, style }) {
  return pug`
    Div.root(style=style)= children
  `
}))
