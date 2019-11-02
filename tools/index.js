/*!
 * UniKorn (v4.0.0): tools/index.js
 * Copyright (c) 2018 - 2019 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

export {
  checks,                                             // Checks
  cleanDev, cleanLogs, cleaner,                       // Cleaners
  cleanStyles, lintSCSS, compile, minifyCSS,          // Styles
  cleanScripts, lintMJS, transpile, minifyJS,         // Scripts
  cleanPages, lintPages, pagile,                      // Pages
  cleanStatics, statica,                              // Statics
  cleanImages, imagine,                               // Images
  pretest, test, tdd, coverage, qunit, visual,        // Tests
  serve } from './tasks';                             // Serve and Watch
