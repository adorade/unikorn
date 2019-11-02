/*!
 * UniKorn (v4.0.0): tools/util/plugins-config.js
 * Copyright (c) 2018 - 2019 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import {
  src, dest, lastRun, log, green, paths, opts, banner
} from '../util';

import gulpRollup from '../rollup';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

// const pkg = require(`${process.cwd()}/package.json`);
// const filename = `${pkg.name}`;

const plugins = [
  resolve(),
  babel({
    // for more options see: .babelrc.js,
    exclude: 'node_modules/**', // Only transpile our source code
    externalHelpersWhitelist: [ // Include only required helpers
      'defineProperties',
      'createClass',
      'inheritsLoose',
      'defineProperty',
      'objectSpread2'
    ]
  })
];
const cache = false;
const format = 'umd';

const plugInOpts = {
  external: ['jquery', 'popper.js', './tooltip', './util'],
  plugins,
  cache
};

const plugOutOpts = {
  format,
  globals: {
    jquery: 'jQuery',
    'popper.js': 'Popper',
    '/mnt/d/Local/htdocs/unikorn/src/mjs/tooltip': 'Tooltip',
    '/mnt/d/Local/htdocs/unikorn/src/mjs/util': 'Util'
  },
};

export function transpileAll () {
  log(`${green('-> Transpiling Plugins...')}`);
  return src(paths.scripts.src, {
    since: lastRun(transpileAll)
  })
    // .pipe(plugins.betterRollup(plugInOpts, plugOutOpts))
    .pipe(gulpRollup(plugInOpts, plugOutOpts))
    .pipe(plugins.rename({ extname: '.js' }))
    .pipe(plugins.header(banner()))
    .pipe(plugins.size(opts.size))
    .pipe(dest(paths.scripts.dest + './all'));
}
transpileAll.displayName = 'transpile:all:mjs';
transpileAll.description = 'Transpile all plugins';
