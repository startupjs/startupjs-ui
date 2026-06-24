import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'
import { StartupjsProvider } from 'startupjs'
import UiProvider from 'startupjs-ui/UiProvider'
import { Stack } from 'expo-router'

export default function RootLayout () {
  const colorScheme = useColorScheme()
  const backgroundColor = colorScheme === 'dark' ? '#171717' : '#ffffff'

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <StartupjsProvider theme='auto'>
          <UiProvider theme='auto'>
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor },
                headerShown: false
              }}
            />
          </UiProvider>
        </StartupjsProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
