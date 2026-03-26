import semverSatisfies from 'semver/functions/satisfies.js'
import semverPrerelease from 'semver/functions/prerelease.js'
import expectedVersion from 'react-native-reanimated/scripts/worklets-version.json'
import compatibilityFile from 'react-native-reanimated/compatibility.json'
import workletsPackageJson from 'react-native-worklets/package.json'

type ValidationResult = { ok: boolean, message?: string }

type CompatibilityRecord = Record<string, {
  'react-native-worklets'?: string[]
}>

export default function validateVersion (reanimatedVersion: string): ValidationResult {
  const workletsVersion = workletsPackageJson.version

  if (!workletsVersion) {
    return {
      ok: false,
      message:
        "react-native-worklets package isn't installed. Please install a version between " +
        expectedVersion.min +
        ' and ' +
        expectedVersion.max +
        ' to use Reanimated ' +
        reanimatedVersion +
        '.'
    }
  }

  if (semverPrerelease(workletsVersion)) return { ok: true }

  const supportedWorkletsVersions: string[] = []
  const compatibility = compatibilityFile as CompatibilityRecord

  for (const key in compatibility) {
    if (semverSatisfies(reanimatedVersion, key)) {
      supportedWorkletsVersions.push(...(compatibility[key]['react-native-worklets'] ?? []))
    }
  }

  if (supportedWorkletsVersions.length === 0) return { ok: true }

  for (const version of supportedWorkletsVersions) {
    if (semverSatisfies(workletsVersion, version)) return { ok: true }
  }

  return {
    ok: false,
    message:
      `Invalid version of \`react-native-worklets\`: "${workletsVersion}". ` +
      `Expected the version to be in inclusive range "${supportedWorkletsVersions.join(', ')}". ` +
      'Please install a compatible version of `react-native-worklets`.'
  }
}
