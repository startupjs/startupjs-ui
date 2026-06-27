# StartupJS UI Architecture

StartupJS UI is the component library layered on top of StartupJS, CSSX, React
Native, and React Native Web. Its job is to provide reusable components with
stable APIs, accessible semantics, CSS-first customization, light/dark themes,
and docs/story coverage.

StartupJS UI does not own the styling engine. CSSX owns CSS parsing, variables,
themes, custom media, parts, and runtime style resolution. StartupJS owns the
framework provider and plugin system. StartupJS UI consumes those primitives.

## Repository Shape

Each public component or support module is a package under `packages/`.

Important packages:

- `packages/startupjs-ui`: meta package with public exports, `plugin.js`,
  `UiProvider`, and the StartupJS UI theme.
- `packages/div`: base layout/pressable primitive.
- `packages/span`: base text primitive and heading typography.
- `packages/button`: button primitive and variants.
- `packages/input` plus `packages/*-input`: input wrapper system and concrete
  inputs.
- `packages/form`: form composition and validation integration.
- `packages/portal`, `packages/dialogs`, `packages/toast`, `packages/modal`,
  `packages/popover`, `packages/drawer`: overlay/provider components.
- `packages/docs` and `packages/mdx`: docs runtime support.
- `packages/core`: shared types, currently kept for `UIRole`.

Generated `.d.ts` files are committed and must stay aligned with source.

## Integration With StartupJS

Apps normally do not render `UiProvider` manually. They render
`StartupjsProvider` from `startupjs`.

`packages/startupjs-ui/plugin.js` exports a StartupJS plugin. Its `renderRoot`
hook wraps the app in `UiProvider`, forwards StartupJS provider `style` and
`theme`, and initializes global custom icons and inputs. Optional `routerPortal`
behavior can also add portal support around router output.

The plugin hook names used for shared registries are `customIcons` and
`customInputs`.

This design lets installing/importing StartupJS UI provide:

- default CSSX theme layers,
- portals,
- toasts,
- dialogs,
- custom icon registry,
- custom input registry.

`packages/file-input/files.plugin.js` is separate plugin wiring for file input
models, server routes, storage, and access hooks.

Docs and Storybook are harnesses and may mount `UiProvider` directly. That is an
exception for documentation/testing environments, not the normal app integration
path.

## `UiProvider`

`UiProvider` is the library-level provider stack. It layers CSSX style inputs:

1. `startupjs/themes/tailwind`
2. `startupjs/themes/shadcn`
3. `startupjsUiTheme`
4. user/provider `style`

These become the `style` prop for CSSX `CssxProvider`. Tailwind and shadcn
provide the base/default and dark token layers; `startupjsUiTheme` provides
component-specific variables and component styles.

`UiProvider` also mounts:

- `Portal.Provider`
- `ToastProvider`
- `DialogsProvider`
- color-scheme synchronization for web document rendering

Legacy props such as `palette`, `colors`, and `componentColors` are intentionally
not the new theming model. They should warn or fail clearly during migration.

## CSS-First Theme Model

StartupJS UI's default design system is CSS variables:

- Tailwind-compatible raw tokens from CSSX.
- shadcn-like semantic tokens from CSSX.
- component-specific tokens from `startupjsUiTheme`.

Examples:

```css
:root {
  --primary: oklch(0.55 0.22 263);
  --color-primary: var(--primary);
  --Button-height: 2.5rem;
}

:root.dark {
  --primary: oklch(0.72 0.18 263);
}
```

Component-specific variables should be derived from semantic tokens whenever
possible. Direct raw palette usage is allowed only when a semantic token is a
poor fit.

Theme-specific rules use CSSX theme custom media:

```css
@media (--theme-dark) {
  .root {
    box-shadow: none;
    border-color: var(--color-border);
  }
}
```

Responsive rules use CSSX custom media:

```css
@media (--breakpoint-tablet) {
  .root {
    flex-direction: row;
  }
}
```

## Component Global Overrides

Components opt into global overrides with CSSX `themed()`:

```tsx
export default observer(themed('Button', function Button (props) {
  return pug`
    Div.root(part='root')
      Span.label(part='label')= props.children
  `
}))
```

Provider CSS can then target component tags:

```css
Button {
  --Button-background-color: var(--color-primary);
}

Button:part(label) {
  font-weight: 600;
}
```

Only global component override selectors should use component tag names.
StartupJS UI no longer uses the old `.Button` class-based override model.

## Parts

`part` defines the public styling API for component internals.

- `part='root'` maps to the root `style` prop.
- `part='icon'` maps to `iconStyle`.
- `part='label'` maps to `labelStyle`.

The CSSX Babel plugin injects or preserves these props. Component authors should
not manually add extra wrappers just to make styling easier. Prefer exposing a
meaningful part on an existing element.

Parts should be:

- stable,
- semantically named,
- documented,
- limited to surfaces users reasonably need to customize.

## Component Authoring Pattern

Most components follow this pattern:

1. Import `pug`, `css`/`styl` if needed, `observer`, and relevant primitives from
   `startupjs`.
2. Implement a TypeScript function component.
3. Return a Pug template.
4. Place inline styles after the return or close to the JSX/Pug that uses them.
5. Wrap with `observer()` when reactive values are used.
6. Wrap with `themed('ComponentName', Component)` when provider tag overrides
   should apply.
7. Export the component and keep its package `.d.ts` in sync.

Inline styles should use CSS variables and CSS functions instead of old Stylus
helpers. Separate component `.cssx.css` or `.cssx.styl` files are avoided in
new code.

## Foundational Primitives

### `Div`

The base layout primitive. It owns common cross-platform behavior around views,
pressable states, disabled/loading semantics where applicable, style parts, and
CSSX-friendly props. Many components should compose `Div` instead of raw
`View`.

### `Span`

The text primitive. It owns typography variants, heading aliases, relative
line-height handling, CSSX styling, and web-only role support through `UIRole`.
Labels should use `Span` where possible so global typography customizations
apply consistently.

### `Button`

Button variants follow the shadcn-like semantic model with migration aliases
where needed. Default should remain a primary action style for StartupJS UI, not
necessarily shadcn's black/white default.

### `DarkMode`

Small switch component for toggling CSSX theme preference with `useTheme()`.
It should be easy to place in Expo Router headers and should not own navigation
theme setup itself. Docs include a copy-paste recipe for making React
Navigation/Expo Router follow CSSX light/dark state.

## Inputs And Forms

`packages/input` provides shared input wrapping, label/error/help text
composition, custom input registry, and common prop handling. Concrete inputs
such as text, select, checkbox, radio, range, date-time, object, and array
inputs build on that layer.

Form-related components should:

- use `Span` for labels and messages where possible,
- preserve accessible label relationships,
- expose meaningful parts,
- support controlled and model-backed usage where historically supported,
- keep old commonly used props warning during migration when feasible.

## Overlays

Portals, dialogs, toasts, modals, popovers, drawers, and sidebars depend on
provider wiring. When debugging them, check:

- `UiProvider`
- `Portal.Provider`
- the component package provider/context
- StartupJS plugin injection
- whether the app is mounted under `StartupjsProvider`

Overlay components must work on React Native and web, so avoid browser-only DOM
assumptions unless guarded behind platform-specific code.

## Docs Architecture

Component docs live with component packages as `README.mdx` files and are
rendered by the docs app. The docs runtime is implemented by `packages/docs` and
`packages/mdx`.

Adding or moving a component docs page usually touches:

- the package `README.mdx`,
- a route wrapper in `docs/app/docs/*.js`,
- the docs sidebar/category data in `docs/app/docs/_layout.js`,
- generated styling reference sections.

Each component page should document:

- purpose and import,
- main usage examples,
- props/sandbox where applicable,
- accessibility notes when relevant,
- parts table,
- component CSS variables table with defaults.

Parts and variable tables are generated from source/theme data by:

```sh
yarn docs:style-reference
```

Manual docs edits should not fight generated sections.

The style-reference generator reads `startupjsUiTheme.js`, scans package source
for `part=` usage, uses curated descriptions for common parts/variables, and
replaces existing "Styling reference" sections in package docs. Dynamic parts
that cannot be statically inferred may need explicit script support.

## Storybook

Storybook is the component QA harness for:

- major variants and sizes,
- interactive states,
- disabled/loading/error states,
- accessibility semantics,
- provider-heavy behavior,
- visual smoke coverage.

Keep stories representative rather than exhaustive. Prefer realistic
compositions over prop cartesian products.

## Public Exports

`packages/startupjs-ui/index.tsx` must match `packages/startupjs-ui/package.json`
exports and the expectations of `@startupjs/babel-plugin-startupjs`, which
rewrites meta-package imports to precise component package imports for tree
shaking.

After changing exports, run:

```sh
yarn generate-package-dts
node scripts/check-startupjs-ui-exports.mjs
```

## Validation Strategy

Use narrow checks for small changes and integration checks for broad styling or
provider work.

- `yarn lint`: lint and style checks.
- `yarn check`: StartupJS/Pug-aware TypeScript check.
- `yarn generate-package-dts`: generated declarations.
- `node scripts/check-startupjs-ui-exports.mjs`: export surface.
- `yarn storybook:test`: Storybook test runner.
- `yarn storybook:build`: static Storybook build.
- `yarn docs` or docs web server: manual visual QA.
- Real StartupJS app smoke test for provider/theme/navigation interactions.

For broad UI refactors, inspect docs pages in light and dark mode and compare
against the stable site for obvious regressions. Similarity does not need to be
pixel-perfect after token changes, but pages must be coherent, readable, and
functionally complete.

## Migration And Compatibility

The current architecture intentionally moved styling from old StartupJS UI
theme helpers into CSSX primitives. Migration docs should explain:

- replacing old `$UI` Stylus variables with CSS variables,
- using `:root` and `:root.dark`,
- using `@media (--breakpoint-*)` instead of old breakpoint helpers,
- using provider `style` overrides,
- using component tag selectors and parts,
- handling dark mode with Expo Router/React Navigation.

Commonly used component props should remain available with warnings when that
makes migration less disruptive. Old provider-level theme systems do not need
to be preserved as a parallel architecture.

## Maintenance Rules

- Keep generic styling primitives in CSSX.
- Keep framework/plugin concerns in StartupJS.
- Keep component behavior and component tokens in StartupJS UI.
- Avoid extra wrapper elements.
- Prefer CSS variables and standards over custom helper APIs.
- Keep docs, Storybook, generated types, exports, and migration guides aligned.
- Update `AGENTS.md` and this file when architecture or package boundaries
  change.
