import { I18nManager, Platform, Settings } from 'react-native'

export default function getLocale (): string {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? window.navigator.language : 'en'
  }

  if (Platform.OS === 'ios') {
    const appleLocale = Settings.get('AppleLocale') as string | undefined
    const appleLanguages = Settings.get('AppleLanguages') as string[] | undefined
    return appleLocale ?? appleLanguages?.[0] ?? 'en'
  }

  return (I18nManager.getConstants() as any).localeIdentifier
}
