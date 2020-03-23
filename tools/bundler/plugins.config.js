/*!
 * UniKorn (v1.0.0): tools/bundler/plugins.config.js
 * Script to build our plugins to use them separately.
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

const path   = require('path');
const rollup = require('rollup');
const babel  = require('rollup-plugin-babel');
const banner = require('./banner');

// Replace console.log
const { green, magenta, red, cyan } = require('ansi-colors');
const log = require('fancy-log');

// Environment: development or test
const mode = process.env.NODE_ENV;
const isTest = mode === 'test';

if (mode !== 'test') {
  log(`${magenta('Looks like we are in development mode!')}`);
} else {
  log(`${magenta('Looks like we are in test mode!')}`);
}

const plugins = [
  babel({
    // for more options see: .babelrc.js,
    exclude: 'node_modules/**', // Only transpile our source code
    externalHelpersWhitelist: [ // Include only required helpers
      'defineProperties',
      'createClass',
      'inheritsLoose',
      'defineProperty',
      'objectSpread2',
      'createSuper'
    ]
  })
];

const uniPlugins = {
  Alert: path.resolve(__dirname, '../../src/mjs/alert.mjs'),
  Button: path.resolve(__dirname, '../../src/mjs/button.mjs'),
  Carousel: path.resolve(__dirname, '../../src/mjs/carousel.mjs'),
  Collapse: path.resolve(__dirname, '../../src/mjs/collapse.mjs'),
  Drawer: path.resolve(__dirname, '../../src/mjs/drawer.mjs'),
  Dropdown: path.resolve(__dirname, '../../src/mjs/dropdown.mjs'),
  Modal: path.resolve(__dirname, '../../src/mjs/modal.mjs'),
  Popover: path.resolve(__dirname, '../../src/mjs/popover.mjs'),
  ScrollSpy: path.resolve(__dirname, '../../src/mjs/scrollspy.mjs'),
  Tab: path.resolve(__dirname, '../../src/mjs/tab.mjs'),
  Toast: path.resolve(__dirname, '../../src/mjs/toast.mjs'),
  Tooltip: path.resolve(__dirname, '../../src/mjs/tooltip.mjs'),
  Util: path.resolve(__dirname, '../../src/mjs/util.mjs')
};
const rootPath = isTest ? '../../dist/js/coverage' : '../../dist/js/plugins';

for(let plugin of Object.keys(uniPlugins)) {
  const external = ['jquery', 'popper.js'];
  const globals = {
    jquery: 'jQuery', // Ensure we use jQuery which is always available even in noConflict mode
    'popper.js': 'Popper'
  };

  // Do not bundle Util in plugins
  if (plugin !== 'Util') {
    external.push(uniPlugins.Util);
    globals[uniPlugins.Util] = 'Util';
  }

  // Do not bundle Tooltip in Popover
  if (plugin === 'Popover') {
    external.push(uniPlugins.Tooltip);
    globals[uniPlugins.Tooltip] = 'Tooltip';
  }

  const pluginFilename = `${plugin.toLowerCase()}.js`;

  rollup.rollup({
    input: uniPlugins[plugin],
    plugins,
    external
  }).then((bundle) => {
    bundle.write({
      format: 'umd',
      file: path.resolve(__dirname, `${rootPath}/${pluginFilename}`),
      name: plugin,
      globals,
      banner: banner(pluginFilename),
      sourcemap: false
    })
      .then(() => {
        isTest
          ? log(`Building ${cyan(`${plugin}`)} coverage... Done!`)
          : log(`Building ${green(`${plugin}`)} plugin... Done!`);
      })
      .catch((err) => log.error(`${red(`${plugin}: ${err}`)}`));
  });
}
