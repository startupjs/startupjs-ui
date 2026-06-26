import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const packagesDir = path.join(root, 'packages')
const themePath = path.join(packagesDir, 'startupjs-ui', 'startupjsUiTheme.js')

const STYLE_REFERENCE_HEADING = 'Styling reference'
const START = '{/* CSSX_STYLE_REFERENCE_START */}'
const END = '{/* CSSX_STYLE_REFERENCE_END */}'
const LEGACY_START = '<!-- CSSX_STYLE_REFERENCE_START -->'
const LEGACY_END = '<!-- CSSX_STYLE_REFERENCE_END -->'

const PACKAGE_PREFIXES = {
  'range-input': ['Range']
}

const LEGACY_SECTION_HEADINGS = [
  'Theme variables',
  'Theme Variables',
  'Custom styles and theme variables'
]

const PART_DESCRIPTIONS = {
  root: 'Root element.',
  text: 'Main text label.',
  label: 'Label text.',
  icon: 'Primary icon.',
  secondaryIcon: 'Secondary icon.',
  loader: 'Loading indicator.',
  badge: 'Badge body.',
  image: 'Image element.',
  fallback: 'Fallback content.',
  status: 'Status indicator.',
  input: 'Input control.',
  control: 'Interactive control.',
  content: 'Content container.',
  container: 'Inner container.',
  wrapper: 'Wrapper element.',
  overlay: 'Overlay element.',
  attachment: 'Attached popover content.',
  arrow: 'Popover arrow.',
  button: 'Button control.',
  item: 'List item.',
  page: 'Page label.',
  close: 'Close button.',
  closeIcon: 'Close icon.',
  actions: 'Actions container.',
  action: 'Action button.',
  title: 'Title text.',
  description: 'Description text.',
  avatar: 'Avatar element.',
  userInfo: 'User details container.',
  name: 'Name text.',
  readonly: 'Readonly value.',
  switchCircle: 'Switch thumb.',
  circle: 'Inner circle.',
  responder: 'Swipe responder area.',
  area: 'Drawer area.',
  case: 'Drawer content case.',
  modal: 'Modal surface.',
  srOnly: 'Screen-reader-only text.',
  progress: 'Progress track.',
  filler: 'Progress fill.',
  star: 'Rating star.',
  value: 'Displayed value.',
  units: 'Units text.',
  remove: 'Remove action.',
  information: 'Information row.',
  toast: 'Toast surface.',
  header: 'Header area.',
  titleWrapper: 'Title wrapper.',
  parts: 'Parts container.'
}

const WORDS = {
  bg: 'background',
  fg: 'foreground',
  x: 'horizontal',
  y: 'vertical',
  xs: 'xs',
  s: 'small',
  m: 'medium',
  l: 'large',
  xl: 'xl',
  xxl: 'xxl',
  rn: 'React Native',
  web: 'web'
}

const TRAILING_MODIFIERS = new Set([
  'xs',
  'small',
  'medium',
  'large',
  'xl',
  'xxl',
  'horizontal',
  'vertical'
])

main()

function main () {
  const variableMap = getThemeVariables()
  const readmes = listReadmes()
  let updated = 0

  for (const readmePath of readmes) {
    const packageName = path.basename(path.dirname(readmePath))
    if (packageName === 'startupjs-ui') continue

    const prefixes = getPackagePrefixes(packageName)
    const variables = prefixes.flatMap(prefix => variableMap.get(prefix) ?? [])
    const parts = getPackageParts(packageName)
    const section = buildSection({ parts, variables })
    const original = fs.readFileSync(readmePath, 'utf8')
    const next = insertSection(removeLegacySections(original), section)

    if (next !== original) {
      fs.writeFileSync(readmePath, next)
      updated++
    }
  }

  console.log(`[update-style-reference-docs] Updated ${updated} README files`)
}

function getThemeVariables () {
  const source = fs.readFileSync(themePath, 'utf8')
  const variables = new Map()
  const customPropertyRe = /--([A-Z][A-Za-z0-9]*)(-[A-Za-z0-9-]+)?\s*:\s*([^;]+);/g

  for (const match of source.matchAll(customPropertyRe)) {
    const [, prefix, suffix = '', rawDefault] = match
    const item = {
      variable: `--${prefix}${suffix}`,
      defaultValue: rawDefault.trim(),
      description: describeVariable(prefix, suffix.replace(/^-/, ''))
    }
    if (!variables.has(prefix)) variables.set(prefix, [])
    variables.get(prefix).push(item)
  }

  return variables
}

function listReadmes () {
  return fs.readdirSync(packagesDir)
    .map(name => path.join(packagesDir, name, 'README.mdx'))
    .filter(filePath => fs.existsSync(filePath))
    .sort()
}

function getPackagePrefixes (packageName) {
  const prefixes = new Set(PACKAGE_PREFIXES[packageName] ?? [])
  const packageDir = path.join(packagesDir, packageName)
  for (const filePath of listSourceFiles(packageDir)) {
    const source = fs.readFileSync(filePath, 'utf8')
    for (const match of source.matchAll(/themed\(['"]([A-Za-z0-9]+)['"]/g)) {
      prefixes.add(match[1])
    }
  }
  if (!prefixes.size) prefixes.add(toPascalCase(packageName))
  return [...prefixes].sort()
}

function getPackageParts (packageName) {
  const parts = new Set()
  const packageDir = path.join(packagesDir, packageName)
  for (const filePath of listSourceFiles(packageDir)) {
    const source = fs.readFileSync(filePath, 'utf8')
    for (const match of source.matchAll(/\bpart\s*=\s*['"]([^'"]+)['"]/g)) {
      parts.add(match[1])
    }
    for (const match of source.matchAll(/\bpart\s*=\s*\[\s*['"]([^'"]+)['"]/g)) {
      parts.add(match[1])
    }
    for (const match of source.matchAll(/\bpart\s*=\s*\[([\s\S]*?)\]/g)) {
      addPartsFromArraySource(parts, match[1])
    }
    for (const match of source.matchAll(/\bpart\s*=\s*\{\s*\[([\s\S]*?)\]\s*\}/g)) {
      addPartsFromArraySource(parts, match[1])
    }
  }
  return [...parts].sort((a, b) => {
    if (a === 'root') return -1
    if (b === 'root') return 1
    return a.localeCompare(b)
  })
}

function addPartsFromArraySource (parts, source) {
  for (const match of source.matchAll(/['"]([^'"]+)['"]/g)) {
    parts.add(match[1])
  }
  for (const match of source.matchAll(/\b([A-Za-z][A-Za-z0-9_]*)\s*:/g)) {
    parts.add(match[1])
  }
}

function listSourceFiles (dir) {
  if (!fs.existsSync(dir)) return []

  const out = []
  walk(dir)
  return out

  function walk (currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (/\.(?:ts|tsx|js|jsx)$/.test(entry.name)) {
        out.push(fullPath)
      }
    }
  }
}

function removeLegacySections (source) {
  let next = source
  for (const heading of LEGACY_SECTION_HEADINGS) {
    const escaped = escapeRegExp(heading)
    next = next.replace(new RegExp(`\\n## ${escaped}\\n[\\s\\S]*?(?=\\n## |\\s*$)`, 'g'), '\n')
  }
  return next
}

function insertSection (source, section) {
  const generated = `${section}\n`
  const startRe = `(?:${escapeRegExp(START)}|${escapeRegExp(LEGACY_START)})`
  const endRe = `(?:${escapeRegExp(END)}|${escapeRegExp(LEGACY_END)})`
  const existingRe = new RegExp(`\\n?${startRe}[\\s\\S]*?${endRe}\\n?`, 'm')
  if (existingRe.test(source)) return source.replace(existingRe, `\n${generated}`)

  const headingMatch = source.match(new RegExp(`(^|\\n)## ${escapeRegExp(STYLE_REFERENCE_HEADING)}\\n`))
  if (headingMatch) {
    const replaceStart = headingMatch.index ?? 0
    const headingStart = replaceStart + headingMatch[1].length
    const nextHeadingIndex = source.indexOf('\n## ', headingStart + headingMatch[0].length)
    const before = source.slice(0, replaceStart)

    if (nextHeadingIndex === -1) {
      return joinGeneratedSection(before, generated)
    }

    return `${joinGeneratedSection(before, generated)}${source.slice(nextHeadingIndex)}`
  }

  const sandboxIndex = source.search(/\n## Sandbox\b/)
  if (sandboxIndex !== -1) {
    return `${joinGeneratedSection(source.slice(0, sandboxIndex), generated)}${source.slice(sandboxIndex)}`
  }

  return joinGeneratedSection(source, generated)
}

function joinGeneratedSection (before, generated) {
  const trimmed = before.replace(/\s*$/, '')
  return `${trimmed}${trimmed ? '\n\n' : ''}${generated}`
}

function buildSection ({ parts, variables }) {
  const lines = [
    `## ${STYLE_REFERENCE_HEADING}`,
    '',
    'Use these names from `StartupjsProvider style` or another CSSX provider style layer for app-wide overrides.',
    'For the full theming model, see the [Styling and theming](/docs/Styling) guide.',
    '',
    '### Parts',
    ''
  ]

  if (parts.length) {
    lines.push('| Part | Description |')
    lines.push('| --- | --- |')
    for (const part of parts) {
      lines.push(`| \`${part}\` | ${describePart(part)} |`)
    }
  } else {
    lines.push('This component does not expose named parts.')
  }

  lines.push('', '### CSS variables', '')

  if (variables.length) {
    lines.push('| Variable | Default | Description |')
    lines.push('| --- | --- | --- |')
    for (const item of variables) {
      lines.push(`| \`${item.variable}\` | \`${escapeTableValue(item.defaultValue)}\` | ${item.description} |`)
    }
  } else {
    lines.push('This component does not expose component-specific CSS variables.')
  }

  return lines.join('\n')
}

function describePart (part) {
  return PART_DESCRIPTIONS[part] ?? `Styles the ${humanize(part)} part.`
}

function describeVariable (prefix, suffix) {
  if (!suffix) return `${prefix} component token.`
  const words = humanizeWords(suffix)
  if (prefix === 'Span' && words.at(-2) === 'line' && words.at(-1) === 'height') {
    return `Controls the ${words.join(' ')} multiplier.`
  }
  const last = words.at(-1)
  if (words.length > 1 && TRAILING_MODIFIERS.has(last)) {
    return `Controls the ${last} ${words.slice(0, -1).join(' ')}.`
  }
  return `Controls the ${words.join(' ')}.`
}

function humanize (input) {
  return humanizeWords(input).join(' ')
}

function humanizeWords (input) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(word => WORDS[word] ?? word)
}

function toPascalCase (input) {
  return input
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function escapeTableValue (value) {
  return value.replaceAll('|', '\\|').replaceAll('`', '\\`')
}

function escapeRegExp (input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
