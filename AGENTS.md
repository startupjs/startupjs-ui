# StartupJS UI — Agent Onboarding

This repository is the source monorepo for `startupjs-ui`: the shared multiplatform UI library used across StartupJS apps. Treat this repo as the source of truth for component behavior, accessibility semantics, provider wiring, and package exports. Downstream apps should validate changes here, not patch around them locally.

## What This Repo Contains

- `packages/*`: one package per component or runtime module.
- `packages/startupjs-ui`: the meta package that re-exports the public surface and injects `UiProvider` into `StartupjsProvider` through the StartupJS plugin system.
- `docs/`: the existing StartupJS + Expo documentation app. It must keep working across this work.
- `storybook/`: the dedicated Expo-based Storybook workspace for component QA. Use it for visual and interaction coverage; keep it web-first for now.
- `scripts/`: repo maintenance scripts such as export checks and type generation.

## Package Boundaries

- Real component/runtime packages live in `packages/*`.
- `packages/docs` and `packages/mdx` are internal docs support packages, not user-facing UI components.
- `packages/core` contains shared theming, helpers, and CSS variables infrastructure.
- `packages/startupjs-ui` is the public aggregator package. If you change provider wiring or exports, inspect it directly.

## StartupJS-Specific Wiring

- `startupjs-ui` integrates with apps through `packages/startupjs-ui/plugin.js`.
- `UiProvider` is injected automatically into `StartupjsProvider`, so downstream apps usually only need:

```jsx
<StartupjsProvider>
  <Layout>{/* app */}</Layout>
</StartupjsProvider>
```

- `UiProvider` mounts:
  - CSS variables / theme context
  - `Portal.Provider`
  - `ToastProvider`
  - `DialogsProvider`

- When debugging missing dialogs, toasts, or custom inputs/icons, inspect:
  - `packages/startupjs-ui/plugin.js`
  - `packages/startupjs-ui/UiProvider.tsx`
  - the package providing the singleton/provider behavior

## Storybook Role

- Storybook is the component QA harness for interactive states, accessibility semantics, and visual regression smoke checks.
- Add one story file per real component/runtime package except:
  - `packages/docs`
  - `packages/mdx`
- `packages/startupjs-ui` may have a minimal integration story when useful, but it is not the main story target.
- Story coverage should be high-signal, not exhaustive prop cartesian products.

Each story file should cover:
- default state
- major variants/sizes
- disabled/loading/error states when relevant
- important interactive flows
- accessibility/testability-critical states
- at least one realistic composition story for provider-heavy components

## Docs App Role

- `docs/` remains the user-facing documentation app.
- Do not break existing docs routes while adding Storybook.
- Use `docs/` as the reference for:
  - StartupJS Babel config
  - Metro config
  - StartupJS client init setup
  - Expo dependency versions

## Accessibility And Testability Standards

Prefer semantic accessibility over custom selectors.

For interactive components on web, aim for:
- correct accessible role exposure (`button`, `link`, `checkbox`, `radio`, `switch`, `dialog`, `tab`, `tablist`, `option`, `combobox`, etc.)
- stable accessible names so Playwright can use `getByRole(...)`
- proper state semantics where relevant:
  - `disabled` / `aria-disabled`
  - `aria-busy`
  - `aria-expanded`
  - `aria-selected`
  - `aria-checked`
- correct label association so form fields can be found with `getByLabel(...)`

Only add `data-testid` when good semantics are still insufficient. If needed for composite widgets, expose predictable slot-level test IDs instead of brittle DOM-structure selectors.

## Editing Guidance

- Keep package APIs stable unless the change is clearly incorrect/outdated enough to justify a breaking release.
- Preserve existing visual language and theming behavior unless the task explicitly changes it.
- When changing provider/singleton packages such as dialogs or toast, think through route remount ordering and stale module-level references.
- When changing web semantics, verify native props still make sense. `role` is web-specific; `accessibilityRole` is cross-platform.
- Prefer importing components from local packages when editing package source. In stories, prefer the public `startupjs-ui` meta package unless a package-specific surface is the thing being tested.

## Required Validation

For meaningful changes, run the relevant checks before finishing:

- `yarn`
- `yarn storybook:web` for manual Storybook smoke testing
- `yarn storybook:build`
- `yarn docs` or `cd docs && yarn web` for docs smoke testing
- `yarn generate-package-dts`
- `node scripts/check-startupjs-ui-exports.mjs`
- `npx eslint .`
- `npx tsc --noEmit --skipLibCheck`

If you touch downstream behavior that is already covered in `dating`, validate there as well via a local `portal:` link to `../startupjs-ui`.

## Sub-Agent Guidance

- Do not delegate before the harness and shared conventions exist.
- Once Storybook scaffolding and source-level fixes are stable, story writing can be split into at most 3 parallel buckets with disjoint file ownership.
- Worker prompts should require:
  - reading this file
  - following the shared story conventions
  - visually checking stories on the web
  - using the `playwright-interactive` skill in headless mode if manual UI debugging helps
  - avoiding shared server conflicts by using isolated ports or short targeted runs instead of assuming one global dev server is theirs alone

## Current Focus

See [tasks.md](/Users/cray0000/ws/www/startupjs-ui/tasks.md) for the live workstreams:
- Storybook harness + stories for every real package
- accessibility / e2e-compatibility upgrades across interactive components
