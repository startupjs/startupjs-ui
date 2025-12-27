import React from 'react'
import { pug, observer } from 'startupjs'
import Div from '@startupjs-ui/div'
import './index.styl'

export default observer(function Td ({ children, style }) {
  return pug`
    Div.root(style=style)= children
  `
})
