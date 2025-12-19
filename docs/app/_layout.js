import { StartupjsProvider } from 'startupjs'
import Portal from '@startupjs-ui/portal'
import { DialogsProvider } from '@startupjs-ui/dialogs'
import { Stack } from 'expo-router'

export default function RootLayout () {
  return (
    <StartupjsProvider>
      <Portal.Provider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: 'white' }
          }}
        />
      </Portal.Provider>
      <DialogsProvider />
    </StartupjsProvider>
  )
}
