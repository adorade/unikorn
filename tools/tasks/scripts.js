/*!
 * UniKorn (v4.0.0): tools/tasks/scripts.js
 * Copyright (c) 2018 - 2019 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import {
  src, dest, lastRun, plugins, del, bs, fs, log, magenta, green,
  dirs, paths, opts, banner, inputOpts, outputOpts
} from '../util';

import gulpRollup from '../rollup';

// For debugging usage:
// .pipe($.debug({ title: 'unicorn:' }))

// Transpiling ES6 to cross-browser-compatible ES5 code
// with Rollup via Babel.js
// -----------------------------------------------------------------------------
export function cleanScripts () {
  log(`${green('-> Clean all scripts')} in ${magenta(paths.scripts.dest)} folder`);
  return del(paths.scripts.dest);
}
cleanScripts.displayName = 'clean:js';
cleanScripts.description = 'Clean up scripts folder';

export function lintMJS () {
  log(`${green('-> Linting MJS files...')}`);

  const outputDir = paths.logs.gulp;
  fs.mkdirSync(`${outputDir}`, { recursive: true });
  const output = fs.createWriteStream( `${outputDir}/scripts.txt` );

  return src(paths.scripts.src, {
    since: lastRun(lintMJS)
  })
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.format('stylish', output))
    .pipe(plugins.eslint.failAfterError());
}
lintMJS.displayName = 'lint:mjs';
lintMJS.description = 'Lint MJS files';

export function transpile () {
  log(`${green('-> Transpiling MJS via Babel...')}`);

  return src(`${dirs.src}/mjs/index.mjs`, {
    sourcemaps: true
  })
    .pipe(gulpRollup(inputOpts, outputOpts))
    .pipe(plugins.header(banner()))
    .pipe(plugins.size(opts.size))
    .pipe(dest(paths.scripts.dest, { sourcemaps: './' }))
    .pipe(bs.stream({ match: '**/*.js' }));
}
transpile.displayName = 'transpile:mjs';
transpile.description = 'Transpile MJS via Babel';

export function minifyJS () {
  log(`${green('-> Minify JS...')}`);

  return src(paths.scripts.filter)
    .pipe(plugins.terser(opts.terser))
    .pipe(plugins.rename({ extname: '.min.js' }))
    .pipe(plugins.header(banner()))
    .pipe(plugins.size(opts.size))
    .pipe(dest(paths.scripts.dest))
    .pipe(bs.stream({ match: '**/*.js' }));
}
minifyJS.displayName = 'min:js';
minifyJS.description = 'Minify JS files';
