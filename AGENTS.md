# Agent Guide: Component Refactoring

This document serves as a guide for Agents refactoring components from the legacy `@startupjs/ui` library to the new `startupjs-ui` monorepo structure. Start with the next unchecked component in the Progress list, follow the Quickstart, and optionally run lint/ts checks.

## Objective

Refactor each component from the `ui` folder (this is a source code of the old `@startupjs/ui` library) into its own package within `packages/`.
The goal is to decouple components and introduce TypeScript interfaces for props to generate better documentation.

## Reference Implementations

- **Span**: `packages/span` (Completed refactoring. Merged H1-H6 into Span).
- **Button**: `ui/components/Button` (Reference for complex props and structure).

## Quickstart (per component)
- Create `packages/<component>` with `package.json` copied from `packages/span`; name `@startupjs-ui/<component>`, deps `@startupjs-ui/core`, peers `react`, `react-native`, `startupjs`. See `packages/span` for a basic example and `ui/components/Button` for a complex one.
- Update `package.json` dependencies to include every `@startupjs-ui/*` package the component actually import (e.g., Div/Icon/Span), not just `core`. Note that docs imports do not matter (since docs are managed by the monorepo itself) and should not be taken into account.
- Copy styles: `index.styl` -> `index.cssx.styl` (and `index.mdx.styl` -> `index.mdx.cssx.styl` if present) without changes.
- Port logic: move `ui/components/<Component>/index.*` to `packages/<component>/index.tsx`; add props interface with JSDoc, defaults in destructuring, remove `propTypes`/`defaultProps`, return `ReactNode`, export `_PropsJsonSchema`.
- Docs: move `Component.en.mdx` -> `packages/<component>/README.mdx`, update imports to new packages; for not-yet-refactored components import from `@startupjs/ui` top-level.
- Register docs page in `docs/clientHelpers/docComponents.js`.

## Refactoring Steps & Tooling Notes

### 1. Create Package
- Create a new directory: `packages/<component-name>` (e.g., `packages/span`).
- Create `package.json`. Use `packages/span/package.json` as a template.
    - **Name**: `@startupjs-ui/<component-name>`
    - **Dependencies**: `@startupjs-ui/core`
    - **Peer Dependencies**: `react`, `react-native`, `startupjs`

### 2. Migrate & Refactor Code
- Move the component code from `ui/components/<Component>` to `packages/<component>/index.tsx`.
- **TypeScript**:
    - Keep runtime logic as-is; only add the minimal types/interface needed.
    - Convert the file to `.tsx` - just change the extension but do not do any actual refactoring of adding types. Do not change the actual JS code whatsoever.
    - **Do NOT** fully type the implementation. Keep it loose and do NOT add any types besides what's needed to define the props interface itself (e.g., `SpanProps`).
    - **MUST** define a single TypeScript interface for props (e.g., `SpanProps`).
    - **MUST** add JSDoc descriptions to each prop in the interface. This is used by the Sandbox to generate documentation tables.
    - Add defaults into the props destructuring of the component itself and remove the Component.defaultProps.
    - Remove the Component.propTypes (the interface handles it now).
    - Specify the return type of the component function to be `ReactNode` (import { type ReactNode } from 'react').
    - Export `_PropsJsonSchema` for docs generation: `export const _PropsJsonSchema = {/* ComponentProps */}`.
    - Babel handles `part="..."` attributes: it auto-injects the corresponding style prop into destructuring and passes it down (e.g., `part='root'` adds `style`, `part='title'` adds `titleStyle`). You generally do not need to manually add `style` to the JSX unless you actually transform it, but you should declare the prop in the interface when relevant.
    - Minimal TS typing beyond the props interface is fine when needed to satisfy `tsc`/ESLint; keep the implementation otherwise unchanged.
    - `index.d.ts` file will be generated automatically by the build system, don't create it yourself.
    - Don't change anything in the original `ui/` components folder - they are only there for a reference, they are not used, and will be completely removed after we finish refactoring all components.
    - If you have to use a component in `.mdx` docs which was not refactored yet, import it from `@startupjs/ui` (old library) via top-level named exports, e.g., `import { NumberInput } from '@startupjs/ui'`.
- **Styles**:
    - Do not change the styles, keep them as is.
    - Ensure `themed` is imported from `@startupjs-ui/core`.
    - Stylus files keep the same content but use `.cssx.styl` extension in packages.

### 3. Update Documentation
- Move `Component.en.mdx` to the new package and rename it to `README.mdx`.
- Update imports to point to the new component.
- Ensure the `Sandbox` component is used and linked to the component and its schema - import _PropsJsonSchema from the component and pass it to Sandbox as propsJsonSchema prop.
- In the docs on where to import the component from change it from '@startupjs/ui' to instead be 'startupjs-ui' (that's the new meta-library which will re-export all individual packages for each component).

### 4. Register in Docs App
- Edit `docs/clientHelpers/docComponents.js`.
- Export the component's MDX file: `export { default as Component } from '../../packages/<component>/README.mdx'`.

## Key Requirements

- **One Package Per Component**: Each component gets its own folder in `packages/`.
- **Props Interface**: The main goal is to have a clean TS interface for props with JSDoc comments.
- **Core Helpers**: Use `@startupjs-ui/core` for shared helpers (re-export them from core if missing).
- **TS Config**: `ui/**` is excluded from `tsconfig.json`; do not move or fix legacy files there.

## Verification

1.  Run `yarn` in the root to link the new package.
2.  Run `cd docs && yarn start -c` to start the docs server.
3.  Open the docs in the browser (usually `http://localhost:8081`).
4.  Navigate to the component page.
5.  **Verify**:
    - The page loads.
    - The Sandbox section appears at the bottom.
    - The props table in Sandbox shows the correct types and **descriptions**.
6.  Optional quick checks: `yarn eslint packages/<component>/index.tsx` and `yarn tsc --noEmit --skipLibCheck`.

## Refactoring Order & Progress

Work through the components in the following order to ensure dependencies are ready when needed.

### Level 0: Independent Components
These components have no internal dependencies (or only depend on utils/core).

- [x] **Span** (`packages/span`)
- [x] **Div** (`packages/div`)
- [x] **Icon** (`packages/icon`)
- [x] **Loader** (`packages/loader`)
- [x] **Br** (`packages/br`)
- [x] **Portal** (`packages/portal`)
- [x] **Layout** (`packages/layout`)

### Level 1: Base Components
These depend only on Level 0 components.

- [x] **Button** (depends on Div, Icon, Loader, Span) (`packages/button`)
- [x] **Badge** (depends on Div, Icon, Span) (`packages/badge`)
- [x] **Avatar** (depends on Div, Icon, Span) (`packages/avatar`)
- [x] **Tag** (depends on Div, Icon, Span) (`packages/tag`)
- [x] **Card** (depends on Div) (`packages/card`)
- [ ] **Tooltip** (depends on Div)
- [ ] **Alert** (depends on Div, Icon)
- [ ] **Content** (depends on Div)
- [ ] **Row** (depends on Div)
- [ ] **Breadcrumbs** (depends on Div, Icon, Span)
- [ ] **Menu** (depends on Div, Icon, Span)
- [ ] **Progress** (depends on Div, Span)
- [ ] **Rating** (depends on Div, Icon)
- [ ] **Tabs** (depends on Div, Span)

### Level 2: Intermediate Components
These depend on Level 1 components.

- [ ] **Link** (depends on Button, Div, Span)
- [ ] **Pagination** (depends on Button, Div, Icon, Span)
- [ ] **User** (depends on Avatar)
- [ ] **Modal** (depends on Portal, Layout, Button)
- [ ] **Sidebar**
- [ ] **DrawerSidebar**
- [ ] **Collapse**
- [ ] **Carousel**

### Level 3: Complex Components
These have deep dependency chains.

- [ ] **Item** (depends on Link)
- [ ] **SmartSidebar** (depends on Sidebar, DrawerSidebar)
- [ ] **AutoSuggest**
- [ ] **Select**
- [ ] **Table**
- [ ] **Dialogs**

## Updating this Guide

**IMPORTANT**: If you discover new patterns, caveats, or simplifications during your work, **UPDATE THIS FILE**.
This guide should evolve to make the work of future Agents easier.
