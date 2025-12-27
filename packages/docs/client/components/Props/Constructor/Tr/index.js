import React from 'react'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import './index.styl'

export default observer(themed(function Tr ({ children, style }) {
  return pug`
    Div.root(style=style)= children
  `
}))
