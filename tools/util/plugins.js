/*!
 * UniKorn (v4.0.0): tools/util/plugins.js
 * Copyright (c) 2018 - 2019 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

// Importing specific gulp API
// functions lets us write them as series() instead of gulp.series()
export { src, dest, series, parallel, lastRun, watch, tree } from 'gulp';

// Load all plugins in "devDependencies" into the variable $
export const $ = require('gulp-load-plugins')({
  // when set to true, the plugin will log info to console.
  // Useful for bug reporting and issue debugging
  // DEBUG: false,

  // whether the plugins should be lazy loaded on demand
  // lazy: true,

  pattern: ['*'],
  scope: ['devDependencies'],
  rename: {
    'fancy-log': 'log',
    'gulp-stylelint': 'gStylelint',
    'gulp-eslint': 'gEslint',
    'gulp-pug-linter': 'pugLinter'
  }
});

// Development or Production?
import { dirs } from './config';
import minimist from 'minimist';

export const args = minimist(process.argv.slice(2)); // NOTE: check args
export const taskTarget = args.production ? dirs.prod : dirs.dev;

// Load others modules
export const bs = require('browser-sync').create();
export const fs = require('fs');
export const karmaServer = require('karma').Server;

// Colors for fancy log
export { bgBlue, bgRed, green, magenta, red } from 'ansi-colors';
