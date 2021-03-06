/*!
 * UniKorn (v1.1.1): .babelrc.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ============================================================================
 */

const presets = [
  ['@babel/env', {
    loose: true,
    modules: false,
    exclude: ['transform-typeof-symbol']
  }]
];
const plugins = [
  '@babel/plugin-proposal-object-rest-spread'
];
const env = {
  test: {
    plugins: [ 'istanbul' ]
  }
};

module.exports = {
  comments: false,
  presets,
  plugins,
  env
};
