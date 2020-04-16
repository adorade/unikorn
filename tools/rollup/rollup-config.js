/*!
 * UniKorn (v1.0.0): tools/util/rollup-config.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import babel from 'rollup-plugin-babel';

const pkg = require(`${process.cwd()}/package.json`);
const filename = `${pkg.name}`;

// Input Options
const external = [...Object.keys(pkg.dependencies || {})]; // 'jquery', 'popper.js'
const plugins = [
  babel({
    // for more options see: .babelrc.js,
    exclude: 'node_modules/**', // Only transpile our source code
    externalHelpersWhitelist: [ // Include only required helpers
      'defineProperties',
      'createClass',
      'inheritsLoose',
      'defineProperty',
      'objectSpread2',
      'createSuper'
    ]
  })
];

// Output Options
const file = `${filename}.js`;
const name = `${filename}`;
const format = 'umd';
const globals = {
  jquery: 'jQuery',
  'popper.js': 'Popper'
};

export const inputOpts = {
  external, plugins
};

export const outputOpts = {
  file, name, format, globals
};