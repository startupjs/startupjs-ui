# @startupjs-ui/docs

> MDX documentation generator

## TODO

- Currently only the `Sandbox` and `Props` components are usable. The full docs app still needs to be updated to work with the new Expo project structure and the new `startupjs-ui` components.

## Prerequisites

You must be using `@startupjs/app` for routing.

You can create a new application with the routing system using the `routing` template:

```sh
npx startupjs init myapp -t routing
```

## Installation

```sh
yarn add @startupjs/docs
```

## Requirements

```
react: 16.9 - 17
react-native: >= 0.61.4 < 0.64.0
startupjs: >= 0.33.0
```

## Usage

Currently this package exports two components:

- **`Sandbox`** -- an interactive playground that renders a component with editable props. It reads a JSON schema generated from the component's TypeScript interface and builds a prop editor UI automatically.
- **`Props`** -- the lower-level component used by Sandbox to render the prop editor and component preview.

### Sandbox

Import the `Sandbox` component and the auto-generated `_PropsJsonSchema` from your component file:

```jsx
import { Sandbox } from '@startupjs-ui/docs'
import MyComponent, { _PropsJsonSchema as MyComponentPropsJsonSchema } from './MyComponent'
```

Then use it in your MDX documentation:

```jsx
<Sandbox
  Component={MyComponent}
  propsJsonSchema={MyComponentPropsJsonSchema}
/>
```

For the JSON schema generation to work, your component file must:

1. Export a magic constant: `export const _PropsJsonSchema = {/* MyComponentProps */}`
2. Export a TypeScript interface for the component props: `export interface MyComponentProps { ... }`
3. Have `babel-preset-startupjs` configured with the `docgen: true` option to transform the TS interface into a JSON schema at build time.

### Full docs app (not yet available)

The full documentation app with sidebar navigation, language switching, and MDX page rendering is not yet available in this version. The setup below is preserved for reference and will work once the docs app is updated.

1. Create a `docs/` folder in your project root.

2. Create a `docs/index.js` file with the following content:
  ```js
  import docs from '@startupjs-ui/docs'
  export default docs({
    typography: {
      type: 'mdx',
      // different titles for mdx documentation in English and Russian
      title: {
        en: 'Typography',
        ru: 'Типографика'
      },
      // different components to display for English and Russian documentation
      component: {
        en: require('../components/typography/Typography.en.mdx').default,
        ru: require('../components/typography/Typography.ru.mdx').default
      }
    },
    cssGuide: {
      type: 'mdx',
      // the same title for both English and Russian mdx documentation
      title: 'Typography',
      // the same component to display for English and Russian documentation
      component: require('../components/typography/Typography.en.mdx').default
    },
    // docs in collapse
    // items have the same api as mdx docs
    components: {
      type: 'collapse',
      title: {
        en: 'Components',
        ru: 'Компоненты'
      },
      items: {
        Button: {
          type: 'mdx',
          title: {
            en: 'Button',
            ru: 'Кнопка'
          }
          component: {
            en: require('../components/Button/Button.en.mdx').default,
            ru: require('../components/Button/Button.ru.mdx').default
          }
        },
        Card: {
          type: 'mdx',
          title: 'Card',
          component: require('../components/Card/Card.en.mdx').default
        }
      }
    }
  })
  ```

3. Add the client-side `docs` app to your `Root/App.js` file:

    ```js
    import docs from '../docs'
    // ...
    <App
      apps={{ main, docs }}
      // ...
    />
    ```

## License

MIT
