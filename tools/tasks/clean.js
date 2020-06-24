/*!
 * UniKorn (v1.1.0): tools/tasks/clean.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import { series, $, green, magenta, dirs } from '../util';

// Clean all output folder
// -----------------------------------------------------------------------------
export function cleanDev () {
  $.log(`${green('-> Clean all files')} in ${magenta(dirs.dest)} folder`);
  return $.del(dirs.dest);
}
cleanDev.displayName = 'clean:dev';
cleanDev.description = 'Clean development output';

export function cleanLogs () {
  $.log(`${green('(-> Clean all logs')} in ${magenta(dirs.logs)} folder`);
  return $.del(dirs.logs);
}
cleanLogs.displayName = 'clean:logs';
cleanLogs.description = 'Clean logs output';

export const cleaner = series(
  cleanDev,
  cleanLogs
);
cleaner.displayName = 'clean:all';
cleaner.description = 'Clean all folders';
