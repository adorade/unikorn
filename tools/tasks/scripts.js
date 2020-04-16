/*!
 * UniKorn (v1.0.0): tools/tasks/scripts.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import {
  src, dest, lastRun, $, bs, fs, green, magenta,
  dirs, paths, opts, banner, inputOpts, outputOpts
} from '../util';

import gulpRollup from '../rollup';

// For debugging usage:
// .pipe($.debug({ title: 'unicorn:' }))

// Transpiling ES6 to cross-browser-compatible ES5 code
// with Rollup via Babel.js
// -----------------------------------------------------------------------------
export function cleanScripts () {
  $.log(`${green('-> Clean all scripts')} in ${magenta(paths.scripts.dest)} folder`);
  return $.del(paths.scripts.dest);
}
cleanScripts.displayName = 'clean:js';
cleanScripts.description = 'Clean up scripts folder';

export function lintJS () {
  $.log(`${green('-> Linting JS files...')}`);

  const outputDir = paths.logs.gulp;
  fs.mkdirSync(`${outputDir}`, { recursive: true });
  const output = fs.createWriteStream( `${outputDir}/scripts.txt` );

  return src(paths.scripts.src, {
    since: lastRun(lintJS)
  })
    .pipe($.gEslint())
    .pipe($.gEslint.format())
    .pipe($.gEslint.format('stylish', output))
    .pipe($.gEslint.failAfterError());
}
lintJS.displayName = 'lint:js';
lintJS.description = 'Lint JS files';

export function copyJS () {
  $.log(`${green('-> Copy JS...')}`);

  return src(paths.scripts.js, {
    sourcemaps: true,
    since: lastRun(copyJS)
  })
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.scripts.dest, { sourcemaps: './' }))
    .pipe(bs.stream({ match: '**/*.js' }));
}
copyJS.displayName = 'copy:js';
copyJS.description = 'Copy JS files';

export function transpile () {
  $.log(`${green('-> Transpiling MJS via Babel...')}`);

  return src(`${dirs.src}/mjs/index.mjs`, {
    sourcemaps: true
  })
    .pipe(gulpRollup(inputOpts, outputOpts))
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.scripts.dest, { sourcemaps: './' }))
    .pipe(bs.stream({ match: '**/*.js' }));
}
transpile.displayName = 'transpile:mjs';
transpile.description = 'Transpile MJS via Babel';

export function minifyJS () {
  $.log(`${green('-> Minify JS...')}`);

  return src(paths.scripts.filter)
    .pipe($.terser(opts.terser))
    .pipe($.rename({ extname: '.min.js' }))
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.scripts.dest))
    .pipe(bs.stream({ match: '**/*.js' }));
}
minifyJS.displayName = 'min:js';
minifyJS.description = 'Minify JS files';
