/*!
 * UniKorn (v1.1.1): tools/tasks/index.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

export { checks } from './checks';                                              // Checks
export { cleanDev, cleanLogs, cleaner } from './clean';                         // Cleaners
export { cleanStyles, lintSCSS, compile, minifyCSS } from './styles';           // Styles
export { cleanScripts, lintJS, copyJS, transpile, minifyJS } from './scripts';  // Scripts
export { cleanPages, lintPages, pagile } from './pages';                        // Pages
export { cleanStatics, statica } from './statics';                              // Statics
export { cleanImages, imagine } from './images';                                // Images
export { pretest, test, tdd, coverage, qunit, visual } from './tests';          // Tests
export { serve } from './serve';                                                // Serve and Watch
