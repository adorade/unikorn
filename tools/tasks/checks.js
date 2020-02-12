/*!
 * UniKorn (v1.0.0): tools/tasks/checks.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import { tree, $, green, magenta, dirs, paths, opts, banner } from '../util';

// Check gulp configuration
// -----------------------------------------------------------------------------
export function checks (done) {
  const gulpTree = tree();
  $.log(green('Gulp Tasks:\n'), gulpTree.nodes);
  $.log(magenta('Directories configuration:\n'), dirs);
  $.log(magenta('Paths configuration:\n'), paths);
  $.log(magenta('Options configuration:\n'), opts);
  $.log(green('Banner:\n'), banner());
  done();
}
checks.displayName = 'check:settings';
checks.description = 'Check gulp configuration';
