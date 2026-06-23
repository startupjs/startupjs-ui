import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StartupjsProvider } from 'startupjs'
import UiProvider from 'startupjs-ui/UiProvider'
import { Stack } from 'expo-router'

export default function RootLayout () {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StartupjsProvider>
          <UiProvider>
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: 'white' },
                headerShown: false
              }}
            />
          </UiProvider>
        </StartupjsProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
