/*!
 * UniKorn (v4.0.0): tools/tasks/styles.js
 * Copyright (c) 2018 - 2019 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import {
  src, dest, lastRun, plugins, paths, opts, banner, bs, del, log, magenta, green
} from '../util';

// For debugging usage:
// .pipe($.debug({ title: 'unicorn:' }))

// Compiling SCSS to cross-browser-compatible CSS code
// -----------------------------------------------------------------------------
export function cleanStyles () {
  log(`${green('-> Clean all styles')} in ${magenta(paths.styles.dest)} folder`);
  return del(paths.styles.dest);
}
cleanStyles.displayName = 'clean:styles';
cleanStyles.description = 'Clean up styles folder';

export function lintSCSS () {
  log(`${green('-> Linting SCSS files...')}`);
  return src(paths.styles.src, {
    since: lastRun(lintSCSS)
  })
    .pipe(plugins.stylelint(opts.styles));
}
lintSCSS.displayName = 'lint:scss';
lintSCSS.description = 'Lint SCSS files';

export function compile () {
  log(`${green('-> Compiling SCSS...')}`);
  return src(paths.styles.src, {
    sourcemaps: true
  })
    .pipe(plugins.sass(opts.sass).on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer(opts.autoprefixer))
    .pipe(plugins.header(banner()))
    .pipe(plugins.size(opts.size))
    .pipe(dest(paths.styles.dest, { sourcemaps: './maps' }))
    .pipe(bs.stream({ match: '**/*.css' }));
}
compile.displayName = 'compile';
compile.description = 'Compile SCSS files';

export function minifyCSS () {
  log(`${green('-> Minify CSS...')}`);
  return src(paths.styles.filter)
    .pipe(plugins.csso(opts.csso))
    .pipe(plugins.rename({ extname: '.min.css' }))
    .pipe(plugins.header(banner()))
    .pipe(plugins.size(opts.size))
    .pipe(dest(paths.styles.dest))
    .pipe(bs.stream({ match: '**/*.css' }));
}
minifyCSS.displayName = 'min:css';
minifyCSS.description = 'Minify CSS files';
