/*!
 * UniKorn (v1.0.0): gulpfile.esm.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import { series } from './tools/util';
import {
  checks, cleanDev, cleanLogs, cleaner, cleanStyles, lintSCSS, compile, minifyCSS,
  cleanScripts, lintJS, copyJS, transpile, minifyJS, cleanPages, lintPages, pagile,
  cleanStatics, statica, cleanImages, imagine,
  pretest, test, coverage, qunit, visual, serve
} from './tools';

/**
 * Check dirs, paths, options and settings
 * -------------------------------------------------------------------------- */
export { checks };

/**
 * Clean - clean all files from 'dist' folder
 * -------------------------------------------------------------------------- */
export { cleanDev, cleanLogs, cleaner };
const clean = cleanDev;

/**
 * Styles - processes style files
 * -------------------------------------------------------------------------- */
const styles = series(lintSCSS, compile, minifyCSS);
export const buildStyles = series(cleanStyles, styles);
buildStyles.displayName = 'build:styles';
buildStyles.description = 'Build only styles files';

/**
 * Scripts - processes script files
 * -------------------------------------------------------------------------- */
const scripts = series(lintJS, copyJS, transpile, minifyJS);
export const buildScripts = series(cleanScripts, scripts);
buildScripts.displayName = 'build:scripts';
buildScripts.description = 'Build only scripts files';

/**
 * Images - processes image files
 * -------------------------------------------------------------------------- */
const images = series(imagine);
export const buildImages = series(cleanImages, images);
buildImages.displayName = 'build:images';
buildImages.description = 'Build only images files';

/**
 * Statics - processes static files
 * -------------------------------------------------------------------------- */
const statics = series(statica);
export const buildStatics = series(cleanStatics, statics);
buildStatics.displayName = 'build:statics';
buildStatics.description = 'Build statics files';

/**
 * Templates - processes templates files
 * -------------------------------------------------------------------------- */
const pages = series(lintPages, pagile);
export const buildPages = series(cleanPages, pages);
buildPages.displayName = 'build:pages';
buildPages.description = 'Build only html files';

/**
 * Test and serve result
 * -------------------------------------------------------------------------- */
export const tester = series(pretest, test);
export { coverage, qunit, visual };

/**
 * Watch and Serve - watch files for changes and reload
 * Starts a BrowerSync instance
 * Watch files for changes
 * -------------------------------------------------------------------------- */
export { serve };

/**
 * Define `build` task - generate files for production
 * Builds the documentation and framework files
 * -------------------------------------------------------------------------- */
export const build = series(
  clean, styles, scripts, images, statics, pages
);

/**
 * Define `dev` task - build, edit source, reload
 * Runs all of the above tasks and then waits for files to change
 * -------------------------------------------------------------------------- */
const dev = series(
  build, serve
);

/**
 * Define default task that can be called by just running `gulp` from cli
 * This is the default task and it does certain things
 * -------------------------------------------------------------------------- */
export default dev;
