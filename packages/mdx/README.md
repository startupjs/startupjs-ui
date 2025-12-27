# MDX components

> Components to use during .mdx compilation

## Installation

```sh
yarn @startupjs-ui/mdx @react-native-clipboard/clipboard
```

## Usage

This will be used automatically by `@startupjs/bundler` to compile `.mdx` and `.md` files.

## Custom components

You can override the default MDX components by setting the custom ones
using the `overrideMDXComponents` function. Do it once as early as possible
(for example in the topmost `_layout` file of your Expo project):

```jsx
// _layout.js
import { overrideMDXComponents } from '@startupjs/mdx'

overrideMDXComponents({
  h1: ({ children }) => <Text style={{ fontSize: 40 }}>{children}</Text>,
  p: ({ children }) => <Text style={{ fontSize: 14 }}>{children}</Text>
})
```

For the full list of components check [here](https://mdxjs.com/table-of-components)

## License

MIT
