/**
 * UniKorn (v1.0.0): warnings.mjs
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * -------------------------------------------------------------------------- */

import $ from 'jquery'

// Check for jQuery dependency
(function jQueryDetection() {
  if (typeof $ === 'undefined') {
    throw new TypeError("UniKorn's JavaScript requires jQuery. jQuery must be included before UniKorn's JavaScript.")
  } else {
    ($ => {
      const version = $.fn.jquery.split(' ')[0].split('.')

      if (version[0] < 3 || version[0] >= 4) {
        throw new Error("UniKorn's JavaScript requires at least jQuery v3.0.0 but less than v4.0.0")
      }
    })($)
  }
})()
