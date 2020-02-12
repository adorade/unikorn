/*!
 * UniKorn (v1.0.0): tools/tasks/styles.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import {
  src, dest, lastRun, $, bs, green, magenta, paths, opts, banner
} from '../util';

// For debugging usage:
// .pipe($.debug({ title: 'unicorn:' }))

// Compiling SCSS to cross-browser-compatible CSS code
// -----------------------------------------------------------------------------
export function cleanStyles () {
  $.log(`${green('-> Clean all styles')} in ${magenta(paths.styles.dest)} folder`);
  return $.del(paths.styles.dest);
}
cleanStyles.displayName = 'clean:styles';
cleanStyles.description = 'Clean up styles folder';

export function lintSCSS () {
  $.log(`${green('-> Linting SCSS files...')}`);
  return src(paths.styles.src, {
    since: lastRun(lintSCSS)
  })
    .pipe($.gStylelint(opts.styles));
}
lintSCSS.displayName = 'lint:scss';
lintSCSS.description = 'Lint SCSS files';

export function compile () {
  $.log(`${green('-> Compiling SCSS...')}`);
  return src(paths.styles.src, {
    sourcemaps: true
  })
    .pipe($.sass(opts.sass).on('error', $.sass.logError))
    .pipe($.autoprefixer(opts.autoprefixer))
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.styles.dest, { sourcemaps: './maps' }))
    .pipe(bs.stream({ match: '**/*.css' }));
}
compile.displayName = 'compile';
compile.description = 'Compile SCSS files';

export function minifyCSS () {
  $.log(`${green('-> Minify CSS...')}`);
  return src(paths.styles.filter)
    .pipe($.csso(opts.csso))
    .pipe($.rename({ extname: '.min.css' }))
    .pipe($.header(banner()))
    .pipe($.size(opts.size))
    .pipe(dest(paths.styles.dest))
    .pipe(bs.stream({ match: '**/*.css' }));
}
minifyCSS.displayName = 'min:css';
minifyCSS.description = 'Minify CSS files';
