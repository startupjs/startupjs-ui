# Agent Guide: Component Refactoring

This document serves as a guide for Agents refactoring components from the legacy `ui` library to the new `startupjs-ui` monorepo structure.

## Objective

Refactor each component from the `ui` folder into its own package within `packages/`.
The goal is to decouple components and introduce TypeScript interfaces for props to generate better documentation.

## Reference Implementations

- **Span**: `packages/span` (Completed refactoring. Merged H1-H6 into Span).
- **Button**: `ui/components/Button` (Reference for complex props and structure).

## Refactoring Steps

### 1. Create Package
- Create a new directory: `packages/<component-name>` (e.g., `packages/span`).
- Create `package.json`. Use `packages/span/package.json` as a template.
    - **Name**: `@startupjs-ui/<component-name>`
    - **Dependencies**: `@startupjs-ui/core`
    - **Peer Dependencies**: `react`, `react-native`, `startupjs`

### 2. Migrate & Refactor Code
- Move the component code from `ui/components/<Component>` to `packages/<component>/index.tsx`.
- **TypeScript**:
    - Convert the file to `.tsx`.
    - **Do NOT** fully type the implementation. Keep it loose (use `any` if needed).
    - **MUST** define a TypeScript interface for props (e.g., `SpanProps`).
    - **MUST** add JSDoc descriptions to each prop in the interface. This is used by the Sandbox to generate documentation tables.
    - Export `_PropsJsonSchema` for docs generation: `export const _PropsJsonSchema = {/* ComponentProps */}`.
- **Styles**:
    - Move `.styl` files.
    - Ensure `themed` is imported from `@startupjs-ui/core`.

### 3. Update Documentation
- Move `Component.en.mdx` to the new package and rename it to `README.mdx`.
- Update imports to point to the new component.
- Ensure the `Sandbox` component is used and linked to the component and its schema.

### 4. Register in Docs App
- Edit `docs/clientHelpers/docComponents.js`.
- Export the component's MDX file: `export { default as Component } from '../../packages/<component>/README.mdx'`.

## Key Requirements

- **One Package Per Component**: Each component gets its own folder in `packages/`.
- **Props Interface**: The main goal is to have a clean TS interface for props with JSDoc comments.
- **Core Helpers**: Use `@startupjs-ui/core` for shared helpers (re-export them from core if missing).

## Verification

1.  Run `yarn` in the root to link the new package.
2.  Run `cd docs && yarn start -c` to start the docs server.
3.  Open the docs in the browser (usually `http://localhost:8081`).
4.  Navigate to the component page.
5.  **Verify**:
    - The page loads.
    - The Sandbox section appears at the bottom.
    - The props table in Sandbox shows the correct types and **descriptions**.

## Progress

Keep this list updated as you complete components.

- [x] **Span** (`packages/span`)
- [ ] **Button**
- [ ] (Add other components here as you discover them)

## Updating this Guide

**IMPORTANT**: If you discover new patterns, caveats, or simplifications during your work, **UPDATE THIS FILE**.
This guide should evolve to make the work of future Agents easier.
