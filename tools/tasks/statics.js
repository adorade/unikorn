/*!
 * UniKorn (v4.0.0): tools/tasks/statics.js
 * Copyright (c) 2018 - 2019 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import {
  src, dest, lastRun, plugins, paths, opts, bs, del, log, magenta, green
} from '../util';

// For debugging usage:
// .pipe($.debug({ title: 'unicorn:' }))

// Processes static files
// -----------------------------------------------------------------------------
export function cleanStatics () {
  log(`${green('-> Clean all statics')} in ${magenta(paths.statics.dest)} folder`);
  return del(paths.statics.dest);
}
cleanStatics.displayName = 'clean:statics';
cleanStatics.description = 'Clean up statics files';

export function statica () {
  log(`${green('-> Copying statics files...')}`);
  return src(paths.statics.src, {
    since: lastRun(statica)
  })
    .pipe(plugins.size(opts.size))
    .pipe(dest(paths.statics.dest))
    .pipe(bs.stream({ match: '**/*.{ico,png,svg,xml,json}' }));
}
statica.displayName = 'statica';
statica.description = 'Copy statics files';
