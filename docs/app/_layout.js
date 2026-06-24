import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StartupjsProvider, useCssVariable } from 'startupjs'
import UiProvider from 'startupjs-ui/UiProvider'
import { Stack } from 'expo-router'

export default function RootLayout () {
  return (
    <SafeAreaProvider>
      <StartupjsProvider>
        <UiProvider>
          <ThemedAppShell />
        </UiProvider>
      </StartupjsProvider>
    </SafeAreaProvider>
  )
}

function ThemedAppShell () {
  const backgroundColor = useCssVariable('--color-background') || '#ffffff'

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor },
          headerShown: false
        }}
      />
    </SafeAreaView>
  )
}
