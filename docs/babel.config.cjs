module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      'babel-preset-expo',
      ['startupjs/babel', {
        docgen: true,
        compileCssImports: true,
        cssFileExtensions: ['cssx.styl', 'cssx.css']
      }]
    ]
  }
}
