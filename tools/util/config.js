/*!
 * UniKorn (v4.0.0): tools/util/config.js
 * Copyright (c) 2018 - 2019 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

export const dirs = {
  root: './',
  src: 'src',
  assets: 'assets',
  build: 'build',
  dest: 'dist',
  test: 'test',
  logs: 'logs'
};

export const paths = {
  styles: {
    src: `${dirs.src}/scss/**/*.scss`,
    comp: `${dirs.src}/scss/unikorn.scss`,
    dest: `${dirs.dest}/css/`,
    filter: `${dirs.dest}/css/*.css`
  },
  scripts: {
    src: [
      `${dirs.src}/mjs/**/*.mjs`,
      `!${dirs.src}/mjs/+(index|warnings).mjs`,
      `!${dirs.src}/mjs/tools/**`
    ],
    dest: `${dirs.dest}/js/`,
    filter: [`${dirs.dest}/js/*.js`, '!**/js/*.min.js'],
    order: [
      `${dirs.src}/mjs/util.mjs`,
      `${dirs.src}/mjs/alert.mjs`,
      `${dirs.src}/mjs/button.mjs`,
      `${dirs.src}/mjs/carousel.mjs`,
      `${dirs.src}/mjs/collapse.mjs`,
      `${dirs.src}/mjs/drawer.mjs`,
      `${dirs.src}/mjs/dropdown.mjs`,
      `${dirs.src}/mjs/modal.mjs`,
      `${dirs.src}/mjs/tooltip.mjs`,
      `${dirs.src}/mjs/popover.mjs`,
      `${dirs.src}/mjs/scrollspy.mjs`,
      `${dirs.src}/mjs/tab.mjs`,
      `${dirs.src}/mjs/toast.mjs`
    ]
  },
  images: {
    src: `${dirs.src}/images/**/*.{gif,jpg,jpeg,png,svg}`,
    dest: `${dirs.dest}/images/`
  },
  statics: {
    src: `${dirs.src}/static/**/*.{ico,png,xml,json,svg}`,
    dest: `${dirs.dest}/static/`
  },
  views: {
    // Ignore files from folders that start with '_'
    src: [`${dirs.src}/views/**/*.pug`, `!${dirs.src}/views/**/_*/**`],
    all: `${dirs.src}/views/**/*.pug`,
    dest: `${dirs.dest}/`,
    del: `${dirs.dest}/*.html`
  },
  test: {
    js: `${dirs.test}/js/`,
    visual: `${dirs.test}/js/visual/`
  },
  logs: {
    bkp: `${dirs.logs}/backup/`,
    cli: `${dirs.logs}/cli/`,
    cov: `${dirs.logs}/coverage/`,
    gulp: `${dirs.logs}/gulp/`
  }
};
