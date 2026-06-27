# Agent Guide

Read this first, then read `architecture.md` for the detailed system map.

StartupJS UI is the shared component library for StartupJS apps. This repository
owns component APIs, styling tokens, parts, accessibility semantics, provider
wiring, docs, Storybook, and package exports.

## Required App-Level Context

StartupJS UI is used inside StartupJS apps. Before maintaining this repo, read
the app-level StartupJS concepts. They describe how users consume StartupJS UI,
how Teamplay/ORM code is written around it, and how E2E tests are expected to
work. Without this context, component or provider changes are easy to make in a
way that breaks real apps. Run:

```sh
npx startupjs skills
```

Then read the `startupjs` skill, especially:

- `AGENTS.md`: how StartupJS apps should be written.
- `E2E_GUIDE.md`: how StartupJS end-project E2E tests should be structured.

Do not duplicate that app-level guide here. This repo's docs focus on the UI
library itself.

## Start Here

1. Read `architecture.md`.
2. Check the component package you are touching.
3. Check the generated public exports in `packages/startupjs-ui`.
4. For app integration behavior, read the `startupjs` skill with
   `npx startupjs skills`.

## Package Map

- `packages/startupjs-ui/`: meta package, public exports, `plugin.js`,
  `UiProvider`, and the default StartupJS UI CSSX theme.
- `packages/*`: one package per component or support module.
- `packages/core/`: shared types only. Keep style/theming primitives in CSSX;
  this package currently remains for shared types such as `UIRole`.
- `packages/docs/` and `packages/mdx/`: documentation runtime support.
- `docs/`: user-facing docs site.
- `storybook/`: web and native Storybook setup.
- `scripts/`: declaration generation, export checks, docs style-reference
  generation, and maintenance scripts.

## Core Contracts

- StartupJS UI integrates into apps through `packages/startupjs-ui/plugin.js`.
  Normal apps mount `StartupjsProvider`; the plugin injects `UiProvider`.
- `UiProvider` layers `tailwindTheme`, `shadcnTheme`, the StartupJS UI theme,
  and user `style` as CSSX style inputs.
- CSSX owns theming, CSS variables, dark mode, custom media, `themed()`,
  `part`, and runtime styling. Do not rebuild those primitives here.
- Component-specific variables use names like `--Button-height` or
  `--Input-border-color` and live in the StartupJS UI theme.
- Component global overrides use tag selectors such as `Button` and
  `Button:part(text)` and require the component to be wrapped in
  `themed('Button', Component)`.
- Public component slots use `part`. `part='root'` maps to `style`; other parts
  map to `{partName}Style`.
- Add parts only for meaningful customization surfaces. Avoid wrapper/inner
  elements unless they are required for behavior.
- Component docs must include component-specific parts and CSS variables where
  applicable. Use the style-reference generation script rather than hand
  drifting generated sections.
- Old palette/theme props are legacy. Keep migration warnings/errors where
  needed, but new styling should be CSS-first.

## Component Authoring Rules

- Prefer `pug` templates and inline `css`/`styl` template literals near the
  component.
- Avoid new `.cssx.css` or `.cssx.styl` component files. Separate files remain
  supported for apps, but StartupJS UI should model the recommended inline
  style approach.
- Use CSS variables, `calc()`, `oklch()`, `color-mix()`, `rem`, and CSSX custom
  media instead of old Stylus helpers or `$UI` variables.
- Prefer semantic shadcn-like tokens such as `--color-primary`,
  `--color-background`, `--color-border`, and component variables derived from
  those tokens.
- Use StartupJS UI primitives (`Div`, `Span`, `Button`, etc.) instead of raw
  React Native components when the primitive provides CSSX integration,
  typography, parts, or accessibility behavior.
- Keep component APIs compatible unless a breaking change is explicit. Removed
  props should usually warn once during migration rather than silently breaking
  common app usage.
- Keep TypeScript prop definitions, generated package `.d.ts` files, docs
  schemas, and runtime behavior aligned.

## Styling And Theming

- Default theme layers are CSSX style inputs:
  `startupjs/themes/tailwind`, `startupjs/themes/shadcn`, and
  `startupjsUiTheme`. Tailwind and shadcn provide base/default plus dark token
  layers; StartupJS UI provides component-specific variables and styles.
- Theme variables are declared on `:root` and `:root.dark`.
- Theme-specific component styles use `@media (--theme-dark)`.
- Breakpoints use CSSX custom media such as `@media (--breakpoint-tablet)`.
- User overrides should normally be passed as provider `style` through
  `StartupjsProvider`, not through old UI-specific theme props.
- `DarkMode` is the simple user-facing switch component. It uses CSSX
  `useTheme()` and should stay easy to drop into navigation headers.

## Accessibility And Testability

Prefer semantic accessibility over custom selectors.

For interactive surfaces on web, aim for:

- correct roles: `button`, `link`, `checkbox`, `radio`, `switch`, `dialog`,
  `tab`, `tablist`, `option`, `combobox`, etc.
- stable accessible names for Playwright `getByRole(...)`.
- proper state semantics: disabled, busy, expanded, selected, checked.
- correct label relationships so controls work with `getByLabel(...)`.

Only add `data-testid` when good semantics are insufficient. If needed for
composite widgets, prefer stable slot-level IDs over DOM-structure selectors.

## Commands

Install dependencies:

```sh
yarn install
```

Run lint and type checks:

```sh
yarn lint
yarn check
```

Run Storybook checks:

```sh
yarn storybook:test
yarn storybook:build
```

Run docs:

```sh
yarn docs
```

Generate declarations and verify public exports:

```sh
yarn generate-package-dts
node scripts/check-startupjs-ui-exports.mjs
```

Update generated component parts/variables docs:

```sh
yarn docs:style-reference
```

## Validation Guidance

Use the checks that match your change:

- Component runtime behavior: component tests/stories plus visual docs smoke.
- Styling/theme changes: docs site in light and dark mode, Storybook, and at
  least one real StartupJS app when possible.
- Provider/plugin changes: StartupJS app smoke with `StartupjsProvider`.
- Type/API changes: `yarn generate-package-dts`, export check, `yarn check`.
- Docs changes: run or inspect docs pages and regenerate style references.

For broad visual changes, manually inspect all affected docs pages and compare
against the stable site where relevant. Component docs should render, look
coherent in light/dark themes, and show accurate parts/variables tables.

Docs and Storybook are harnesses: they may mount `UiProvider` manually because
they are not normal end-user apps booted through a StartupJS app shell. Normal
apps should receive `UiProvider` through the StartupJS plugin.

## Change Guidance

- Treat `AGENTS.md` and `architecture.md` as living onboarding docs. If your
  change alters package boundaries, public APIs, provider/theme flow, commands,
  testing expectations, or maintenance rules, update these files in the same
  change before handing work back.
- Keep CSSX-related fixes in CSSX unless the behavior is genuinely specific to
  StartupJS UI components.
- Keep StartupJS integration fixes in StartupJS unless this repo's plugin or
  `UiProvider` is wrong.
- Keep app-level instructions in the StartupJS skill.
- If app-level E2E or onboarding docs are mirrored in this repo for the public
  docs site, keep them synchronized with the StartupJS skill and treat the skill
  as the source of truth.
- Keep `packages/core` small; do not move styling helpers back into it.
- Avoid adding invisible wrapper elements to solve styling issues. First look
  for a better part, CSS variable, or primitive-level fix.
- Update `architecture.md`, component docs, migration guides, and generated
  declaration files when public behavior changes.
