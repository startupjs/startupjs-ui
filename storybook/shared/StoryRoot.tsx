import { type ReactNode } from 'react'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StartupjsProvider } from 'startupjs'
import RouterContext from '@startupjs/utils/RouterContext'
import { Content, Div, Layout, ScrollView, UiProvider } from 'startupjs-ui'
import './bootstrap'

export type StoryLayout = 'centered' | 'content' | 'fullscreen'

export function StoryRoot ({
  children,
  layout = 'content'
}: {
  children: ReactNode
  layout?: StoryLayout
}) {
  const router = {
    basename: '/',
    push (url: string) {
      if (typeof window !== 'undefined') window.history.pushState(null, '', url)
    },
    replace (url: string) {
      if (typeof window !== 'undefined') window.history.replaceState(null, '', url)
    },
    back () {
      if (typeof window !== 'undefined') window.history.back()
    },
    navigate (url: string) {
      if (typeof window !== 'undefined') window.history.pushState(null, '', url)
    },
    canGoBack () {
      return true
    },
    setParams () {},
    usePathname () {
      return typeof window !== 'undefined' ? window.location.pathname : '/storybook'
    }
  }

  let content

  switch (layout) {
    case 'centered':
      content = (
        <Div style={{ flex: 1 }} align='center' vAlign='center'>
          {children}
        </Div>
      )
      break
    case 'fullscreen':
      content = <View style={{ flex: 1 }}>{children}</View>
      break
    default:
      content = (
        <ScrollView full>
          <Content padding>{children}</Content>
        </ScrollView>
      )
  }

  return (
    <SafeAreaProvider>
      <StartupjsProvider>
        <RouterContext.Provider value={router}>
          <UiProvider>
            <Layout>{content}</Layout>
          </UiProvider>
        </RouterContext.Provider>
      </StartupjsProvider>
    </SafeAreaProvider>
  )
}
