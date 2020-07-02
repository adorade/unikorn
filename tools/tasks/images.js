/*!
 * UniKorn (v1.1.1): tools/tasks/images.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import {
  src, dest, lastRun, $, bs, green, magenta, paths, opts
} from '../util';

// For debugging usage:
// .pipe($.debug({ title: 'unicorn:' }))

// Optimizing images for production
// -----------------------------------------------------------------------------
export function cleanImages () {
  $.log(`${green('-> Clean all images')} in ${magenta(paths.images.dest)} folder`);
  return $.del(paths.images.dest);
}
cleanImages.displayName = 'clean:img';
cleanImages.description = 'Clean up images folder';

export function imagine () {
  $.log(`${green('-> Optimizing images...')}`);
  return src(paths.images.src, {
    since: lastRun(imagine)
  })
    .pipe($.imagemin([
      $.imagemin.gifsicle(opts.images.gif),
      $.imagemin.mozjpeg(opts.images.jpeg),
      $.imagemin.optipng(opts.images.png),
      $.imagemin.svgo(opts.images.svg)
    ], opts.images.general))
    .pipe($.size(opts.size))
    .pipe(dest(paths.images.dest))
    .pipe(bs.stream({ match: '**/*.{gif,jpg,jpeg,png,svg}' }));
}
imagine.displayName = 'imagine';
imagine.description = 'Optimize imagines';
