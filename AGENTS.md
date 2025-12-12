# Agent Guide: Component Refactoring

This document serves as a guide for Agents refactoring components from the legacy `@startupjs/ui` library to the new `startupjs-ui` monorepo structure. Start with the next unchecked component in the Progress list, follow the Quickstart, and optionally run lint/ts checks.

## Objective

Refactor each component from the `ui` folder (this is a source code of the old `@startupjs/ui` library) into its own package within `packages/`.
The goal is to decouple components and introduce TypeScript interfaces for props to generate better documentation.

## Reference Implementations

- **Span**: `packages/span` (Completed refactoring. Merged H1-H6 into Span).
- **Button**: `packages/button` (Reference for complex props and structure).

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
    - Convert the file to `.tsx` - just change the extension, keep runtime logic as-is.
    - Only add the minimal types/interface needed - when making proper typing is too complex you can occasionally use 'any'.
    - **MUST** define a single TypeScript interface for props of the main component you are refactoring (e.g., `SpanProps`), it must define all props. If the component extends another component (e.g. passes the rest of the props to Div) then extend the interface from it and if `tsc` complains then use Omit on the conflicting props.
    - **MUST** add JSDoc descriptions to each prop in the interface. This is used by the Sandbox to generate documentation table.
    - Add defaults into the props destructuring of the component itself and remove the Component.defaultProps.
    - Remove the Component.propTypes (the interface handles it now).
    - Specify the return type of the component function to be `ReactNode` (import { type ReactNode } from 'react').
    - Export `_PropsJsonSchema` for docs generation: `export const _PropsJsonSchema = {/* ComponentProps */}`.
    - Babel handles `part="..."` attributes: it auto-injects the corresponding style prop into destructuring and passes it down (e.g., `part='root'` adds `style`, `part='title'` adds `titleStyle`). You generally do not need to manually add `style` to the JSX unless you actually transform it, but you should declare the prop in the interface when relevant.
    - Implement minimal TS typing beyond the props interface when needed to satisfy `tsc`/ESLint; keep the implementation otherwise as close to original JS code as possible.
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
- [x] **Alert** (depends on Div, Icon) (`packages/alert`)
- [x] **Content** (depends on Div) (`packages/content`)
- [ ] **Row** (depends on Div)
- [x] **Breadcrumbs** (depends on Div, Icon, Span) (`packages/breadcrumbs`)
- [x] **Menu** (depends on Div, Icon, Span) (`packages/menu`)
- [ ] **Progress** (depends on Div, Span)
- [x] **Rating** (depends on Div, Icon) (`packages/rating`)
- [x] **Tabs** (depends on Div, Span) (`packages/tabs`)
- [x] **Pagination** (depends on Button, Div, Icon, Span) (`packages/pagination`)
- [x] **ScrollView** (`packages/scroll-view`)

### Level 2: Intermediate Components
These depend on Level 1 components.

- [x] **Link** (depends on Button, Div, Span) (`packages/link`)
- [x] **User** (depends on Avatar) (`packages/user`)
- [x] **Modal** (depends on Portal, Layout, Button) (`packages/modal`)
- [x] **Sidebar** (`packages/sidebar`)
- [x] **DrawerSidebar** (`packages/drawer-sidebar`)
- [x] **Collapse** (`packages/collapse`)
- [x] **Carousel** (`packages/carousel`)

### Level 3: Complex Components
These have deep dependency chains.

- [x] **Item** (depends on Link) (`packages/item`)
- [x] **SmartSidebar** (depends on Sidebar, DrawerSidebar) (`packages/smart-sidebar`)
- [ ] **AutoSuggest**
- [ ] **Table**
- [ ] **Dialogs**

### Level 4: Forms
Form components from ui/components/forms/*

- [x] **TextInput** (`packages/text-input`)
- [ ] **ArrayInput** (ui/components/forms/ArrayInput)
- [x] **Checkbox** (ui/components/forms/Checkbox) (`packages/checkbox`)
- [ ] **ColorPicker** (ui/components/forms/ColorPicker)
- [ ] **DateTimePicker** (ui/components/forms/DateTimePicker)
- [ ] **FileInput** (ui/components/forms/FileInput)
- [ ] **Form** (ui/components/forms/Form)
- [ ] **Input** (ui/components/forms/Input)
- [ ] **Multiselect** (ui/components/forms/Multiselect)
- [x] **NumberInput** (`packages/number-input`)
- [ ] **ObjectInput** (ui/components/forms/ObjectInput)
- [x] **PasswordInput** (`packages/password-input`)
- [x] **Radio** (`packages/radio`)
- [x] **RangeInput** (`packages/range-input`)
- [ ] **Rank** (ui/components/forms/Rank)
- [x] **Select** (`packages/select`)

## Updating this Guide

**IMPORTANT**: If you discover new patterns, caveats, or simplifications during your work, **UPDATE THIS FILE**.
This guide should evolve to make the work of future Agents easier.
