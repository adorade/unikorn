/*!
 * UniKorn (v4.0.0): tools/tasks/pages.js
 * Copyright (c) 2018 - 2019 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import {
  src, dest, lastRun, plugins, paths, opts, bs, fs, del, log, magenta, green
} from '../util';

// For debugging usage:
// .pipe($.debug({ title: 'unicorn:' }))

// Generating HTML from templates and content files
// -----------------------------------------------------------------------------
export function cleanPages () {
  log(`${green('-> Clean all pages')} in ${magenta(paths.views.dest)} folder`);
  return del(paths.views.del);
}
cleanPages.displayName = 'clean:pages';
cleanPages.description = 'Clean up html files';

export function lintPages () {
  log(`${green('-> Linting templates...')}`);
  return src(paths.views.all, {
    since: lastRun(lintPages)
  })
    .pipe(plugins.pugLinter({ reporter: 'default' }))
    .pipe(plugins.pugLinter({ failAfterError: true }));
}
lintPages.displayName = 'lint:pages';
lintPages.description = 'Lint pug (views) files';

export function pagile () {
  log(`${green('-> Generating Pages via Pug...')}`);

  // Data from `global.json`
  const dataFile = paths.views.datas + 'global.json';
  const dataJson = JSON.parse(fs.readFileSync(dataFile));

  return src(paths.views.src)
    .pipe(plugins.data(() => dataJson))
    .pipe(plugins.pug(opts.pug))
    .pipe(plugins.size(opts.size))
    .pipe(dest(paths.views.dest))
    .pipe(bs.stream({ match: '**/*.html' }));
}
pagile.displayName = 'pagile';
pagile.description = 'Generate Pages via Pug';
