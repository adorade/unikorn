/**
 * UniKorn (v1.1.1): alert.mjs
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * -------------------------------------------------------------------------- */

import $ from 'jquery'
import Util from './util'

const Alert = (($) => {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------ */

  const NAME               = 'alert'
  const VERSION            = Util.VERSION
  const DATA_KEY           = `uni.${NAME}`
  const EVENT_KEY          = `.${DATA_KEY}`
  const DATA_API_KEY       = '.data-api'
  const JQUERY_NO_CONFLICT = $.fn[NAME]

  const ClassName = {
    ALERT : 'alert',
    FADE  : 'fade',
    SHOW  : 'show'
  }

  const Event = {
    CLOSE          : `close${EVENT_KEY}`,
    CLOSED         : `closed${EVENT_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const Selector = {
    DISMISS : '[data-dismiss="alert"]'
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------ */

  class Alert {
    constructor(element) {
      this._element = element
    }

    // Public

    close(element) {
      let rootElement = this._element
      if (element) {
        rootElement = this._getRootElement(element)
      }

      const customEvent = this._triggerCloseEvent(rootElement)

      if (customEvent.isDefaultPrevented()) {
        return
      }

      this._removeElement(rootElement)
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      this._element = null
    }

    // Private

    _getRootElement(element) {
      const selector = Util.getSelectorFromElement(element)
      let parent     = false

      if (selector) {
        parent = document.querySelector(selector)
      }

      if (!parent) {
        parent = $(element).closest(`.${ClassName.ALERT}`)[0]
      }

      return parent
    }

    _triggerCloseEvent(element) {
      const closeEvent = $.Event(Event.CLOSE)

      $(element).trigger(closeEvent)
      return closeEvent
    }

    _removeElement(element) {
      $(element).removeClass(ClassName.SHOW)

      if (!$(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element)
        return
      }

      const transitionDuration = Util.getTransitionDurationFromElement(element)

      $(element)
        .one(Util.TRANSITION_END, (event) => this._destroyElement(element, event))
        .emulateTransitionEnd(transitionDuration)
    }

    _destroyElement(element) {
      $(element)
        .detach()
        .trigger(Event.CLOSED)
        .remove()
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        const $element = $(this)
        let data       = $element.data(DATA_KEY)

        if (!data) {
          data = new Alert(this)
          $element.data(DATA_KEY, data)
        }

        if (config === 'close') {
          data[config](this)
        }
      })
    }

    static _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault()
        }

        alertInstance.close(this)
      }
    }

    // Getters

    static get VERSION() {
      return VERSION
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------ */

  $(document)
    .on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()))

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------ */

  $.fn[NAME] = Alert._jQueryInterface
  $.fn[NAME].Constructor = Alert
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Alert._jQueryInterface
  }

  return Alert
})($)

export default Alert
