import React from 'react'
import { pug, observer } from 'startupjs'
import Div from '@startupjs-ui/div'

export default observer(function Thead ({ children, style }) {
  return pug`
    Div(style=style)= children
  `
})
