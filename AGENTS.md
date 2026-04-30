# StartupJS UI — Agent Onboarding

This repository is the source monorepo for `startupjs-ui`: the shared multiplatform UI library used across StartupJS apps. Treat this repo as the source of truth for component behavior, accessibility semantics, provider wiring, Storybook QA coverage, and package exports.

## What This Repo Contains

- `packages/*`: one package per component or runtime module.
- `packages/startupjs-ui`: the meta package that re-exports the public surface and wires the UI provider into StartupJS.
- `packages/docs` and `packages/mdx`: internal docs support packages, not normal app-facing components.
- `packages/core`: shared theming, helpers, CSS variables, and other low-level infrastructure.
- `docs/`: the user-facing StartupJS + Expo documentation app.
- `storybook/`: shared Storybook workspace with native `.rnstorybook` and web `.storybook` setups.
- `scripts/`: repo maintenance scripts such as export checks and declaration generation.
- `tasks.md`: the live QA ledger and follow-up backlog.

## Repo Responsibilities

- Keep public package APIs stable unless a breaking change is intentional and explicit.
- Prefer fixing shared accessibility or semantics problems here instead of expecting downstream apps to patch around them.
- Keep `docs/` working while evolving Storybook.
- Keep Storybook web stories aligned with real component behavior and natural first-time-user expectations.

## StartupJS UI Wiring

- `startupjs-ui` integrates with apps through [plugin.js](packages/startupjs-ui/plugin.js).
- `UiProvider` is injected automatically into `StartupjsProvider`, so downstream apps usually only need:

```jsx
<StartupjsProvider>
  <Layout>{/* app */}</Layout>
</StartupjsProvider>
```

- `UiProvider` mounts:
  - CSS variables and theme context
  - `Portal.Provider`
  - `ToastProvider`
  - `DialogsProvider`

When debugging missing dialogs, toasts, portals, or shared icon/input behavior, inspect:
- [plugin.js](packages/startupjs-ui/plugin.js)
- [UiProvider.tsx](packages/startupjs-ui/UiProvider.tsx)
- the package implementing the singleton or provider behavior

## Storybook And Docs Roles

### Storybook

Storybook is the component QA harness for:
- interactive states
- accessibility semantics
- testability and E2E friendliness
- visual smoke coverage

Story files should be high-signal, not exhaustive prop cartesian products. Cover:
- default state
- major variants and sizes
- disabled/loading/error states when relevant
- important interaction flows
- accessibility-critical behavior
- realistic compositions for provider-heavy components

Keep currently desirable but not yet passing expectations in colocated non-executed `failingFollowup` specs, and track the work in [tasks.md](tasks.md).

### Docs

`docs/` remains the user-facing documentation app. Use it as a reference for:
- StartupJS Babel config
- Expo dependency versions
- docs-facing examples
- real app-style integration behavior

Do not break docs routes or docs build output while working on Storybook or package internals.

## Accessibility And Testability Standards

Prefer semantic accessibility over custom selectors.

For interactive surfaces on web, aim for:
- correct role exposure: `button`, `link`, `checkbox`, `radio`, `switch`, `dialog`, `tab`, `tablist`, `option`, `combobox`, etc.
- stable accessible names so Playwright can naturally use `getByRole(...)`
- proper state semantics where relevant:
  - `disabled` / `aria-disabled`
  - `aria-busy`
  - `aria-expanded`
  - `aria-selected`
  - `aria-checked`
- correct label relationships so controls can be found with `getByLabel(...)`

Only add `data-testid` when good semantics are still insufficient. If needed for composite widgets, prefer predictable slot-level test IDs over brittle DOM-structure selectors.

A selector problem is often also an accessibility problem:
- if a human cannot clearly understand or activate a control, E2E will usually be awkward too
- if Playwright needs brittle selectors, the UI is often under-accessible

## Required Validation

For meaningful changes, run the relevant checks before finishing:

- `yarn storybook:test`
- `yarn storybook:build`
- `yarn docs` or `cd docs && yarn web` for manual smoke testing when needed
- `yarn build-static` or `yarn build` in `docs` when docs behavior changed
- `yarn generate-package-dts`
- `node scripts/check-startupjs-ui-exports.mjs`
- `npx eslint .`

Use the checks that match the scope of the change rather than blindly running everything on every small edit.

## E2E Guidance

There is a deeper generic guide at [E2E_GUIDE.md](E2E_GUIDE.md).

Read it when you need to:
- add or debug Playwright coverage in a StartupJS app
- design selectors and semantics so UI components are naturally testable
- understand recommended StartupJS production-backed E2E setup
- reason about when a problem belongs in app code vs shared UI library code

## StartupJS — Generic Guide For AI Agents

This section is framework guidance that applies across StartupJS projects, not just this repo.

## Project Setup

StartupJS is built on top of Expo. A new project is created by:

1. Creating an Expo app: `yarn create expo-app myapp` or `npx create-expo-app@latest myapp`
2. Installing StartupJS: `npm init startupjs@latest`
3. Wrapping the root layout in `app/_layout.tsx` with `<StartupjsProvider>` from `startupjs` and `<Layout>` from `startupjs-ui` inside it

```jsx
import { StartupjsProvider } from 'startupjs'
import { Layout } from 'startupjs-ui'
import { Stack } from 'expo-router'

export default function RootLayout () {
  return (
    <StartupjsProvider>
      <Layout>
        <Stack screenOptions={{ headerShown: false }} />
      </Layout>
    </StartupjsProvider>
  )
}
```

Requirements:
- Node 22+
- Yarn optional
- MongoDB and Redis are not needed for normal development because they are mocked automatically

Known issue after `npm init startupjs@latest`:
- add `sharedb-redis-pubsub` overrides/resolutions and reinstall, otherwise the app may crash with `Redis is already connecting/connected`

## Running The App

Typical commands:

```bash
npm run web
npm run ios
npm run android
```

Equivalent forms:

```bash
npm start -- --web
npm start -- --ios
npm start -- --android
```

The default web app usually runs on `http://localhost:8081`.

## Imports

Core framework:

```js
import { $, observer, useSub, sub, pug } from 'startupjs'
```

UI components:

```js
import { Button, Card, Span, TextInput, Div, Content, Checkbox } from 'startupjs-ui'
```

Prefer `startupjs-ui` components over `react-native` ones when the equivalent exists.

## Pug Templates

StartupJS uses `pug` as the standard template language instead of JSX.

Basic syntax:

```js
return pug`
  Div.container
    Span.title Hello World
    Button(onPress=handleClick) Click Me
`
```

Key rules:
- nesting is indentation-based
- `.className` maps to `styleName`
- attributes go in parentheses
- text follows the tag
- interpolation uses `#{...}`
- boolean attributes can be written without `=true`

Conditionals:

```js
pug`
  if isLoggedIn
    Span Welcome back!
  else
    Button(onPress=login) Log In
`
```

Loops:

```js
pug`
  each $todo in $todos
    Card(key=$todo.getId())
      Span= $todo.title.get()
`
```

## Signals

Signals are the core reactive primitive.

Root data signal:

```js
$.todos
$.todos['abc123']
$.todos['abc123'].title
```

Local signals:

```js
const $count = $(0)
const { $name, $age } = $({ name: 'Alice', age: 30 })
```

Reading:

```js
$user.name.get()
$todo.get()
```

Writing:

```js
$user.name.set('Bob')
await $todo.completed.set(true)
```

Other common operations:

```js
await $todo.del()
await $.todos.add({ title: 'Buy milk' })
await $todo.assign({ title: 'Updated' })
await $user.tags.push('developer')
await $user.loginCount.increment(1)
```

Important:
- use `.getId()` for document IDs
- do not use `.id.get()` to read the document id

## Subscriptions

Subscribe before reading database data.

Inside React:

```js
const $todo = useSub($.todos[todoId])
const $todos = useSub($.todos, { completed: false })
```

Outside React:

```js
const $todo = await sub($.todos[todoId])
```

Private collections such as `$._session` do not need subscriptions.

## observer()

Wrap every component with `observer()` by default. It is required for:
- signals reactivity
- `useSub` subscriptions
- styles caching

## Passing Signals To Children

Pass signals, not eagerly-read values, whenever possible.

Prefer:

```js
UserName($name=$user.name)
```

over:

```js
UserName(name=$user.name.get())
```

Call `.get()` as late as possible.

## Private Collections And Current User

Private collections live only on the client:

```js
const userId = $._session.userId.get()
```

Typical current-user pattern:

```js
const userId = $._session.userId.get()
const $user = useSub($.users[userId])

if (!$user.get()) {
  throw $.users.add({ id: userId, name: '', settings: {} })
}
```

Use `throw`, not `await`, when creating docs during render. Let Suspense handle it.

## UI Structure Guidance

Common page pattern:

```js
pug`
  ScrollView(full)
    Content(padding)
      Span(h1) My Page
`
```

Layout example:

```js
pug`
  Div(row align='between' vAlign='center')
    Span Left
    Button Right
`
```

Always wrap raw text in `Span`, not directly in `Div`.

## Styling

Use a top-level `style(lang='styl')` block inside the returned pug template.

```js
return pug`
  Div.root
    Span.title Hello
  style(lang='styl')
    .root
      padding 2u
    .title
      font-weight bold
`
```

Guidelines:
- use Stylus syntax
- keep the `style(lang='styl')` block at the top level of the returned template
- prefer `styleName` classes over inline `style`
- use `u` spacing units instead of `px`

Use inline `style` only for truly dynamic JS-driven values.

## Routing

StartupJS apps commonly use Expo Router file-based routing:

- `app/index.tsx` -> `/`
- `app/about.tsx` -> `/about`
- `app/users/[id].tsx` -> `/users/:id`
- `app/_layout.tsx` wraps child routes

Navigation can be declarative or imperative:

```js
import { Link } from 'expo-router'
import { router } from 'expo-router'
```

## Common Mistakes

Do not:
- use `.id` instead of `.getId()`
- read database signals without subscribing first
- forget `observer()`
- default to `useState`/`useEffect` for reactive data when signals are the right tool
- place raw text directly inside `Div`
- rely on inline `style` for normal styling
- use `px` for standard spacing
- pass raw values to child components too early

## Current Focus

See [tasks.md](tasks.md) for the live workstreams:
- Storybook coverage and follow-up pass
- accessibility and E2E compatibility improvements across interactive components
