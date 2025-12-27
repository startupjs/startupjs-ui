import defaultMdxComponents from './client/mdxComponents/index.js'

const mdxComponents = { ...defaultMdxComponents }

// this can be used to override default MDX components globally
export function overrideMDXComponents (newComponents) {
  Object.assign(mdxComponents, newComponents)
}

// magic named export used by @mdx-js/mdx (in mdxLoader of @startupjs/bundler)
export function useMDXComponents () {
  return mdxComponents
}

export default mdxComponents
