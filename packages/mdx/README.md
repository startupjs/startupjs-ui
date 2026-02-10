# MDX components

MDX provider with a set of custom components for React Native support and syntax highlighting. It maps standard Markdown and HTML elements (headings, paragraphs, lists, tables, code blocks, etc.) to React Native components so that `.mdx` and `.md` files render correctly on all platforms.

## Installation

```sh
yarn add @startupjs-ui/mdx expo-clipboard
```

## Usage

This package is used automatically by `@startupjs/bundler` to compile `.mdx` and `.md` files. No additional configuration is required -- the bundler picks up the `useMDXComponents` export and applies the component mappings during compilation.

## Custom components

You can override the default MDX components globally by calling the `overrideMDXComponents` function. Call it once as early as possible (for example, in the topmost `_layout` file of your Expo project):

```jsx
// _layout.js
import { overrideMDXComponents } from '@startupjs-ui/mdx'

overrideMDXComponents({
  h1: ({ children }) => <Text style={{ fontSize: 40 }}>{children}</Text>,
  p: ({ children }) => <Text style={{ fontSize: 14 }}>{children}</Text>
})
```

For the full list of overridable component names, see the [MDX Table of Components](https://mdxjs.com/table-of-components/).

## Exports

- **default** -- an object containing all MDX component mappings
- **overrideMDXComponents(newComponents)** -- merges your custom components into the global component map, overriding any existing mappings for the same keys
- **useMDXComponents()** -- returns the current component map (used internally by `@mdx-js/mdx`)

## Built-in component mappings

The following Markdown elements are mapped to React Native components out of the box:

- **h1** -- renders as a bold `Span` with `h2` styling
- **h2** -- renders as a `Span` with `h5` styling followed by a divider line
- **h3** -- renders as a bold `Span` with `h6` styling
- **h4, h5, h6** -- render as standard paragraph text
- **p** -- renders as a `Span`; inside blockquotes, uses a special blockquote style
- **strong** -- bold `Span`
- **em** -- italic `Span`
- **a** -- renders as a `Link` component
- **ul, ol, li** -- list items with bullet or ordered markers; nested ordered lists use alphabetic markers
- **blockquote** -- renders as an `Alert` component
- **table, thead, tbody, tr, td, th** -- renders using the `Table` component
- **img** -- renders as a React Native `Image` with automatic aspect-ratio scaling
- **hr** -- renders as a large `Divider`
- **code** -- inline code uses a monospace `Span`; block code uses the `Code` component with syntax highlighting
- **pre** -- wraps block-level code

## Syntax highlighting

Code blocks support syntax highlighting for the following languages: JSX, Stylus, Pug, Markdown, JSON, and Bash (including `sh`). The highlighting is powered by [refractor](https://github.com/wooorm/refractor).

## License

MIT
