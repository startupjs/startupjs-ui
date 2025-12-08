import { View, ScrollView } from 'react-native'
import { pug, styl, observer } from 'startupjs'
import { Slot, Link, usePathname, Stack, useGlobalSearchParams } from 'expo-router'
import * as DOC_COMPONENTS from '../../clientHelpers/docComponents'

const DOC_COMPONENT_NAMES = Object.keys(DOC_COMPONENTS).sort()

export default observer(({ children }) => {
  const { component } = useGlobalSearchParams()

  return pug`
    View.root
      Stack.Screen(
        options={ title: 'Docs' + (component ? ' / ' + component : '') }
      )
      ScrollView.sidebar
        each component in DOC_COMPONENT_NAMES
          Item(key=component)= component
      ScrollView.contentWrapper
        View.content
          Slot
  `
  styl`
    .root
      flex-direction: row
      flex: 1
    .sidebar
      padding-top 10px
      max-width: 200px
      border-right 1px solid #ccc
    .contentWrapper
      flex: 1
    .content
      flex: 1
      max-width: 800px
      width: 100%
      align-self: center
      padding: 20px 20px 0 20px
  `
})

const Item = observer(({ children }) => {
  const pathname = usePathname()
  if (typeof children !== 'string') return 'NO_NAME'
  const name = children
  const href = '/docs/' + children
  const isActive = pathname === href
  return pug`
    Link.item(styleName={ isActive } href=href)
      = name
  `
  styl`
    .item
      padding: 10px 20px
      &.isActive
        background-color: rgba(black, 0.05)
  `
})
