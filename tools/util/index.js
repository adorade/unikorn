/*!
 * UniKorn (v1.1.1): tools/util/index.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

// Load plugins
export {
  src, dest, series, parallel, lastRun, watch, tree,
  args, taskTarget, $, bs, fs, karmaServer,
  bgBlue, bgRed, green, magenta, red
} from './plugins';

// Banner and wrapper
export { banner } from './banner';

// Config
export { dirs, paths } from './config';

// Rollup config
export { inputOpts, outputOpts } from '../rollup/rollup-config';

// Options
export { opts } from './options';
