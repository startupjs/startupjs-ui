import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StartupjsProvider } from 'startupjs'
import Portal from '@startupjs-ui/portal'
import { DialogsProvider } from '@startupjs-ui/dialogs'
import { ToastProvider } from '@startupjs-ui/toast'
import { Stack } from 'expo-router'

export default function RootLayout () {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StartupjsProvider>
          <Portal.Provider>
            <ToastProvider />
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: 'white' },
                headerShown: false
              }}
            />
          </Portal.Provider>
          <DialogsProvider />
        </StartupjsProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
