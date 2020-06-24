/*!
 * UniKorn (v1.1.0): test/js/karma.conf.js
 * Karma configuration.
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ============================================================================
 *
 * Usage:
 *   `yarn run test` or `yarn test`
 *   `gulp tester`
 */

module.exports = (config) => {
  config.set({

    // Base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../..',

    // Frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['qunit', 'sinon', 'detectBrowsers'],

    // List of plugins to load
    // Docs: http://karma-runner.github.io/3.0/config/plugins.html
    // By default, Karma loads all sibling NPM modules which have a name starting with karma-*.
    // available framework: https://www.npmjs.com/search?q=keywords:karma-plugin
    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-qunit',
      'karma-sinon',
      'karma-detect-browsers',
      'karma-coverage-istanbul-reporter'
    ],

    // List of files / patterns to load in the browser
    files: [
      'node_modules/jquery/dist/jquery.slim.min.js',
      'node_modules/popper.js/dist/umd/popper.min.js',
      'node_modules/hammer-simulator/index.js',
      // files for karma-coverage-istanbul-reporter
      'dist/js/coverage/util.js',
      'dist/js/coverage/tooltip.js',
      'dist/js/coverage/!(util|index|tooltip).js',
      // unit test files
      'test/js/unit/*.spec.js'
    ],

    // Client configuration
    client: {
      qunit: {
        showUI: true
      }
    },

    // Test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [process.env.TRAVIS ? 'dots' : 'progress', 'coverage-istanbul'],

    // Coverage Istanbul Reporter
    coverageIstanbulReporter: {
      dir: 'logs/coverage/',
      reports: ['html', 'text-summary'],
      thresholds: {
        emitWarning: false,
        global: {
          statements: 90,
          branches: 86,
          functions: 89,
          lines: 90
        }
      }
    },

    // The port where the web server will be listening
    port: 9876,

    // Enable / disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: false,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    // CLI --single-run --no-single-run
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // Configure custom launchers
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        // base: 'Chrome',
        flags: [
          '--no-sandbox'
        ],
        displayName: 'Chrome w/o sandbox'
      },
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless']
      }
    },

    // Detecting all browsers installed on the current system
    // https://github.com/litixsoft/karma-detect-browsers
    detectBrowsers: {
      // enable/disable phantomjs support, default is true
      usePhantomJS: false,

      // Post processing of browsers list
      // here you can edit the list of browsers used by karma
      postDetection: function (availableBrowsers) {
        if (availableBrowsers.length > 0) {
          if (process.env.CI === true || availableBrowsers.includes('Chrome')) {
            return ['ChromeHeadlessNoSandbox']
          }

          if (availableBrowsers.includes('Firefox')) {
            return ['FirefoxHeadless']
          }
        } else {
          throw new Error('Please install Chrome or Firefox')
        }
      }
    }
  })
}
