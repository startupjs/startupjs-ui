import React from 'react'
import { pug, observer } from 'startupjs'
import Div from '@startupjs-ui/div'
import './index.styl'

export default observer(function Table ({ children, style }) {
  return pug`
    Div.root(style=style)= children
  `
})
