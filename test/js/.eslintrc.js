/*!
 * UniKorn (v1.1.0): test/js/.eslintrc.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

module.exports = {
  env: {
    es6: false,
    jquery: true,
    qunit: true
  },
  globals: {
    unikorn: false,
    sinon: false,
    Util: false,
    Alert: false,
    Button: false,
    Carousel: false,
    Collapse: false,
    Drawer: false,
    Dropdown: false,
    Modal: false,
    Popover: false,
    ScrollSpy: false,
    Tab: false,
    Toast: false,
    Tooltip: false,
    Simulator: false
  },
  parserOptions: {
    ecmaVersion: 5,
    sourceType: "script"
  },
  extends: "../../.eslintrc.js",
  rules: {
    // Best Practices
    "consistent-return": "off",
    "no-alert": "off",
    "no-console": "off",
    "no-magic-numbers": "off",
    "vars-on-top": "off",

    // Stylistic Issues
    "func-style": "off",
    "spaced-comment": "off",

    // ECMAScript 6
    "no-var": "off",
    "object-shorthand": "off",
    "prefer-arrow-callback": "off",
    "prefer-template": "off",
    "prefer-rest-params": "off"
  }
}
