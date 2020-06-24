/*!
 * UniKorn (v1.1.0): tools/bundler/rollup.config.js
 * Rollup configuration file
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

// https://github.com/rollup/plugins/tree/master/packages/babel
import babel from '@rollup/plugin-babel';
// https://github.com/TrySound/rollup-plugin-terser
import { terser } from 'rollup-plugin-terser';
import pkg from '../../package.json';
const getBanner = require('./banner');

// Replace console.log
const { magenta } = require('ansi-colors');
const log = require('fancy-log');

// Environment: development or production
const mode = process.env.NODE_ENV;
const isProd = mode === 'production';

if (mode !== 'production') {
  log(`${magenta('Looks like we are in development mode!')}`);
} else {
  log(`${magenta('Looks like we are in production mode!')}`);
}

// Helpers
const name = pkg.name;
const destPath = './dist/js/bundler'; // path relative to root

// Config
const external = [...Object.keys(pkg.dependencies || {})];
const plugins = [
  babel({
    // for more options see: .babelrc.js,
    babelHelpers: 'bundled'
  }),
  isProd ? terser({
    output: {
      // comments: 'false'  // inherit from .babelrc.js
    },
    keep_classnames: true,
    keep_fnames: true
  }) : {}
];
const globals = {
  jquery: 'jQuery', // Ensure we use jQuery which is always available even in noConflict mode
  'popper.js': 'Popper'
};
const sourcemap = isProd ? false : true;

// Different formats of the generated bundle.
const formats = ['es', 'umd'];
const output = [];
for (let value of Object.keys(formats)) {
  let format = formats[value];
  let filename = isProd ? `${name}.${format}.min.js` : `${name}.${format}.js`;
  let file = isProd ? `${destPath}/${filename}` : `${destPath}/${filename}`;
  let banner = getBanner(filename);

  let outputOptions = {
    format,
    file,
    name,
    globals,
    banner,
    sourcemap
  };

  output.push(outputOptions);
}

export default {
  input: './src/mjs/index.mjs', // path relative to root
  external,
  plugins,
  output,
  // watch: {
  //   include: './src/mjs/**/*.mjs'
  // }
};
