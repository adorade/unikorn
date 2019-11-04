/*!
 * UniKorn (v4.0.0): tools/tasks/serve.js
 * Copyright (c) 2018 - 2019 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import {
  lintSCSS, compile, lintMJS, transpile, lintPages, pagile, imagine, statica
} from './';
import {
  series, watch, dirs, paths, opts, bs,
  log, green, magenta, red, bgRed, bgBlue
} from '../util';

// Automatically reload assets or refresh your browser when changes occur
// -----------------------------------------------------------------------------
export function serve (done) {
  // Serve files from the 'dist' directory of this project
  bs.init({
    server: {
      baseDir: dirs.dest
    },
    port: 3333,
    logPrefix: 'UniKorn',
    ui: false
  });

  function watchEvent (path, event, task) {
    log(
      `File ${magenta(path)} was ${green(event)} running ${red(task)}`
    );
  }

  // NOTE: tasks must be a function with `.displayName`
  const watchers = [
    {
      name: 'Styles',
      paths: paths.styles.src,
      tasks: [lintSCSS, compile]
    },
    {
      name: 'Scripts',
      paths: paths.scripts.src,
      tasks: [lintMJS, transpile]
    },
    {
      name: 'Images',
      paths: paths.images.src,
      tasks: [imagine]
    },
    {
      name: 'Statics',
      paths: paths.statics.src,
      tasks: [statica]
    },
    {
      name: 'Pages',
      paths: paths.views.all,
      tasks: [lintPages, pagile]
    }
  ];

  for (let watcher of watchers) {
    log(bgRed(`Watching ${watcher.name}`));

    for (let p of [watcher.paths]) {
      log(`${bgBlue('Source:')} ${magenta(p)}`);
    }

    let taskNames = [];

    for (let value of Object.values(watcher.tasks)) {
      let taskName = value.displayName;
      taskNames.push(taskName);
    }

    watch(
      watcher.paths, opts.watch, series(watcher.tasks)
    )
      .on('all', (event, path) => {
        watchEvent(path, event, taskNames);
      });
  }

  done();
}
serve.displayName = 'serve:watch';
serve.description = 'Serve and Watch';
