import { I18nManager, NativeModules, Platform } from 'react-native'

export default function getLocale (): string {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? window.navigator.language : 'en'
  }

  if (Platform.OS === 'ios') {
    const settings = NativeModules.SettingsManager?.settings
    const appleLocale = settings?.AppleLocale as string | undefined
    const appleLanguages = settings?.AppleLanguages as string[] | undefined
    return appleLocale ?? appleLanguages?.[0] ?? 'en'
  }

  return (I18nManager.getConstants() as any).localeIdentifier
}
