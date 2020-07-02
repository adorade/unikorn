/*!
 * UniKorn (v1.1.1): tools/util/options.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import { paths } from './config';

export const opts = {
  styles: {
    failAfterError: true,
    reportOutputDir: paths.logs.gulp,
    reporters: [
      { formatter: 'string', save: 'styles.txt', console: true }
    ],
    syntax: 'scss'
  },
  sass: {
    outputStyle: 'expanded',
    precision: 6
  },
  autoprefixer: {
    // browsers: [], // see .browserslistrc
    cascade: false
  },
  csso: {
    restructure: false,
    comments: false
  },
  eslint: {
    // see .eslintrc.json
  },
  babel: {
    // see .babelrc.js
  },
  terser: {
    output: {
      comments: false
    },
    keep_classnames: true,
    keep_fnames: true
  },
  images: {
    gif: { interlaced: true },
    jpeg: { progressive: true },
    png: { optimizationLevel: 4 },
    svg: { plugins: [{ removeViewBox: true }] },
    general: {
      silent: true
    },
    webp: { // https://github.com/imagemin/imagemin-webp#options
      preset: 'default',
      quality: 60
    }
  },
  pug: {
    doctype: 'html',
    pretty: '  '
  },
  htmlmin: {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    // removeEmptyElements: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
  },
  size: {
    gzip: true,
    showFiles: true
  },
  watch: {
    delay: 2000
  }
};
