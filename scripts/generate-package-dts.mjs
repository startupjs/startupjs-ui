#!/usr/bin/env node
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const packagesDir = path.join(rootDir, 'packages')
const eslintConfigPath = path.join(rootDir, 'eslint.config.mjs')
const fileBanner = '/* eslint-disable */\n// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.\n\n'

async function main () {
  const packageEntries = await fs.readdir(packagesDir, { withFileTypes: true })
  const packagesToBuild = []
  const packageJsonsUpdated = []

  for (const entry of packageEntries) {
    if (!entry.isDirectory()) continue
    const pkgDir = path.join(packagesDir, entry.name)
    const pkgJsonPath = path.join(pkgDir, 'package.json')
    let packageJson
    try {
      packageJson = JSON.parse(await fs.readFile(pkgJsonPath, 'utf8'))
    } catch {
      continue
    }

    if (packageJson.main === 'index.tsx') {
      if (packageJson.types !== 'index.d.ts') {
        packageJson.types = 'index.d.ts'
        await fs.writeFile(pkgJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
        packageJsonsUpdated.push(pkgJsonPath)
      }
      const entryFile = path.join('packages', entry.name, 'index.tsx')
      packagesToBuild.push({ name: entry.name, entryFile })
    }
  }

  if (packagesToBuild.length === 0) {
    console.log('[generate-package-dts] No packages with main "index.tsx" found.')
    return
  }

  const tempDir = path.join(rootDir, '.tmp', 'generate-dts')
  const outDir = path.join(tempDir, 'out')
  await fs.rm(tempDir, { recursive: true, force: true })
  await fs.mkdir(outDir, { recursive: true })

  const extraDtsFiles = await collectDeclarationFiles([
    path.join(rootDir, 'types'),
    ...packagesToBuild.map(pkg => path.join(packagesDir, pkg.name))
  ])

  const tsconfigPath = path.join(tempDir, 'tsconfig.json')
  const tsconfig = {
    extends: '../../tsconfig.json',
    compilerOptions: {
      noEmit: false,
      emitDeclarationOnly: true,
      declaration: true,
      declarationMap: false,
      outDir: './out',
      rootDir: '../..',
      skipLibCheck: true
    },
    include: [],
    exclude: [
      '../../docs/**/*',
      '../../storybook/**/*'
    ],
    files: [
      ...packagesToBuild.map(pkg => path.relative(tempDir, path.join(rootDir, pkg.entryFile))),
      ...extraDtsFiles.map(file => path.relative(tempDir, file))
    ]
  }

  await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2))

  console.log('[generate-package-dts] Generating declaration files...')
  const result = spawnSync('yarn', ['tsc', '--project', path.relative(rootDir, tsconfigPath)], {
    cwd: rootDir,
    stdio: 'inherit'
  })

  if (result.status !== 0) {
    throw new Error('Type declaration generation failed.')
  }

  const generatedFiles = []
  for (const pkg of packagesToBuild) {
    const sourceDts = path.join(outDir, pkg.entryFile.replace(/\.tsx$/, '.d.ts'))
    const targetDts = path.join(rootDir, pkg.entryFile.replace(/\.tsx$/, '.d.ts'))
    try {
      const sourceContent = await fs.readFile(sourceDts, 'utf8')
      const contentWithBanner = sourceContent.startsWith(fileBanner)
        ? sourceContent
        : fileBanner + sourceContent
      await fs.writeFile(targetDts, contentWithBanner)
      generatedFiles.push(targetDts)
      console.log(`[generate-package-dts] Updated ${path.relative(rootDir, targetDts)}`)
    } catch (err) {
      throw new Error(`Failed to copy declaration for ${pkg.name}: ${err.message}`)
    }
  }

  const relativeGeneratedFiles = generatedFiles
    .map(file => toPosixPath(path.relative(rootDir, file)))
    .sort()

  const eslintConfigUpdated = await updateEslintConfig(relativeGeneratedFiles)

  const filesToStage = [
    ...relativeGeneratedFiles,
    ...packageJsonsUpdated.map(file => path.relative(rootDir, file))
  ]
  if (eslintConfigUpdated) filesToStage.push(path.relative(rootDir, eslintConfigPath))

  if (filesToStage.length) {
    spawnSync('git', ['add', ...filesToStage], {
      cwd: rootDir,
      stdio: 'inherit'
    })
  }

  await fs.rm(tempDir, { recursive: true, force: true })
}

async function collectDeclarationFiles (directories) {
  const files = []
  for (const dir of directories) {
    try {
      const stats = await fs.stat(dir)
      if (!stats.isDirectory()) continue
    } catch {
      continue
    }

    const stack = [dir]
    while (stack.length) {
      const current = stack.pop()
      const entries = await fs.readdir(current, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(current, entry.name)
        if (entry.isDirectory()) {
          stack.push(fullPath)
          continue
        }
        if (!entry.name.endsWith('.d.ts')) continue
        if (entry.name === 'index.d.ts') continue
        files.push(fullPath)
      }
    }
  }
  return Array.from(new Set(files))
}

async function updateEslintConfig (relativeGeneratedFiles) {
  const existingConfig = await fs.readFile(eslintConfigPath, 'utf8')
  const blockRegex = /^([ \t]*)\/\/ AUTO-GENERATED START \(generate-package-dts\)\n[\s\S]*?^\1\/\/ AUTO-GENERATED END$/m
  const match = existingConfig.match(blockRegex)

  if (!match) {
    throw new Error('Could not find auto-generated declaration ignore block in eslint.config.mjs.')
  }

  const indent = match[1]
  const itemIndent = indent
  const autoBlock = [
    `${indent}// AUTO-GENERATED START (generate-package-dts)`,
    `${indent}// DO NOT EDIT MANUALLY. Managed by scripts/generate-package-dts.mjs`,
    ...relativeGeneratedFiles.map(file => `${itemIndent}'${file}',`),
    `${indent}// AUTO-GENERATED END`
  ].join('\n')

  const newConfig = existingConfig.replace(blockRegex, autoBlock)
  if (newConfig === existingConfig) return false

  await fs.writeFile(eslintConfigPath, newConfig)
  return true
}

function toPosixPath (filePath) {
  return filePath.split(path.sep).join('/')
}

main().catch(err => {
  console.error('[generate-package-dts]', err.message)
  process.exit(1)
})
