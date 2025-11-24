import React from 'react'
import { Text } from 'react-native'
import { pug } from 'startupjs'
import { useLocalSearchParams } from 'expo-router'
import * as DOC_COMPONENTS from '../../clientHelpers/docComponents'

export default function ComponentDoc () {
  const { component } = useLocalSearchParams()
  const Component = DOC_COMPONENTS[component]

  if (!Component) {
    return pug`
      Text Component "#{component}" not found
    `
  }
  return pug`Component`
}
