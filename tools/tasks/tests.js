/*!
 * UniKorn (v1.0.0): tools/tasks/tests.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

import { $, bs, karmaServer, green, magenta, dirs, paths } from '../util';

// Run test and watch results in the browser
// -----------------------------------------------------------------------------
// Clean coverage files before test start
export function pretest (done) {
  $.log(`${green('-> Clean coverage files')} in ${magenta(paths.logs.cov)} folder`);
  $.del(paths.logs.cov, done);
  done();
}
pretest.description = 'Clean coverage files before test start';

// Run test once and exit
export function test (done) {
  $.log(`${green('-> Run test once and exit')}`);
  new karmaServer({
    configFile: __dirname + '/../../test/js/karma.conf.js',
    singleRun: true
  }, exitCode => {
    $.log(`Karma has exited with ${exitCode}`);
    // comment if you want to use with `coverage` task
    // process.exit(exitCode)
  // }, done).start();
  }).start();
  done();
}
test.description = 'Run test once and exit';

// Watch for file changes and re-run tests on each change (Test Driven Development)
export function tdd (done) {
  $.log(`${green('-> Run test and watch for file changes')}`);
  new karmaServer({
    configFile: __dirname + '/../../test/js/karma.conf.js',
    singleRun: false
  }, exitCode => {
    $.log(`Karma has exited with ${exitCode}`);
  // }, done).start();
  }).start();
  done();
}
tdd.description = 'Re-run tests on each change';

// Serve coverage results in browser
export function coverage () {
  $.log(`${green('-> Serve coverage results')}`);
  bs.init({
    server: {
      baseDir: paths.logs.cov
    },
    port: 1234,
    logPrefix: 'Coverage',
    ui: false
  });
}
coverage.description = 'Serve coverage results';

// Serve unit test results in browser
export function qunit () {
  $.log(`${green('-> Serve unit test results in browser')}`);
  bs.init({
    server: {
      baseDir: paths.test.js,
      routes: {
        '/dist': dirs.dest,
        '/node_modules': './node_modules'
      }
    },
    port: 1357,
    logPrefix: 'Qunit',
    ui: false
  });
}
qunit.description = 'Serve unit test results';

// Serve visual test in browser
export function visual () {
  $.log(`${green('-> Serve visual test in browser')}`);
  bs.init({
    server: {
      baseDir: paths.test.visual,
      routes: {
        '/dist': dirs.dest,
        '/node_modules': './node_modules'
      }
    },
    port: 4321,
    logPrefix: 'Visual',
    ui: false
  });
}
visual.description = 'Serve visual test';
