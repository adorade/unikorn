$(function () {
  'use strict'

  const { module, test } = QUnit

  window.Toast = typeof unikorn !== 'undefined' ? unikorn.Toast : Toast

  module('toast plugin', () => {
    test('should be defined on jquery object', (assert) => {
      assert.expect(1)
      assert.ok($(document.body).toast, 'toast method is defined')
    })
  })

  module('toast', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.unikornToast = $.fn.toast.noConflict()
    },
    afterEach: function () {
      $.fn.toast = $.fn.unikornToast
      delete $.fn.unikornToast
      $('#qunit-fixture').html('')
    }
  })

  test('should provide no conflict', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.toast, 'undefined', 'toast was set back to undefined (org value)')
  })

  test('should return toast version', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof Toast.VERSION, 'string')
  })

  test('should throw explicit error on undefined method', (assert) => {
    assert.expect(1)
    var $el = $('<div/>')
    $el.unikornToast()

    try {
      $el.unikornToast('noMethod')
    } catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  test('should return jquery collection containing the element', (assert) => {
    assert.expect(2)

    var $el = $('<div/>')
    var $toast = $el.unikornToast()
    assert.ok($toast instanceof $, 'returns jquery collection')
    assert.strictEqual($toast[0], $el[0], 'collection contains element')
  })

  test('should auto hide', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="1">' +
        '<div class="toast-body">' +
          'a simple toast' +
        '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .unikornToast()
      .appendTo($('#qunit-fixture'))

    $toast.on('hidden.uni.toast', function () {
      assert.strictEqual($toast.hasClass('show'), false)
      done()
    })
      .unikornToast('show')
  })

  test('should not add fade class', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="1" data-animation="false">' +
        '<div class="toast-body">' +
          'a simple toast' +
        '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .unikornToast()
      .appendTo($('#qunit-fixture'))

    $toast.on('shown.uni.toast', function () {
      assert.strictEqual($toast.hasClass('fade'), false)
      done()
    })
      .unikornToast('show')
  })

  test('should allow to hide toast manually', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="1" data-autohide="false">' +
        '<div class="toast-body">' +
          'a simple toast' +
        '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .unikornToast()
      .appendTo($('#qunit-fixture'))

    $toast
      .on('shown.uni.toast', function () {
        $toast.unikornToast('hide')
      })
      .on('hidden.uni.toast', function () {
        assert.strictEqual($toast.hasClass('show'), false)
        done()
      })
      .unikornToast('show')
  })

  test('should do nothing when we call hide on a non shown toast', (assert) => {
    assert.expect(1)

    var $toast = $('<div />')
      .unikornToast()
      .appendTo($('#qunit-fixture'))

    var spy = sinon.spy($toast[0].classList, 'contains')

    $toast.unikornToast('hide')

    assert.strictEqual(spy.called, true)
  })

  test('should allow to destroy toast', (assert) => {
    assert.expect(2)

    var $toast = $('<div />')
      .unikornToast()
      .appendTo($('#qunit-fixture'))

    assert.ok(typeof $toast.data('uni.toast') !== 'undefined')

    $toast.unikornToast('dispose')

    assert.ok(typeof $toast.data('uni.toast') === 'undefined')
  })

  test('should allow to destroy toast and hide it before that', (assert) => {
    assert.expect(4)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="0" data-autohide="false">' +
        '<div class="toast-body">' +
          'a simple toast' +
        '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .unikornToast()
      .appendTo($('#qunit-fixture'))

    $toast.one('shown.uni.toast', function () {
      setTimeout(function () {
        assert.ok($toast.hasClass('show'))
        assert.ok(typeof $toast.data('uni.toast') !== 'undefined')

        $toast.unikornToast('dispose')

        assert.ok(typeof $toast.data('uni.toast') === 'undefined')
        assert.ok($toast.hasClass('show') === false)

        done()
      }, 1)
    })
      .unikornToast('show')
  })

  test('should allow to config in js', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var toastHtml =
      '<div class="toast">' +
        '<div class="toast-body">' +
          'a simple toast' +
        '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .unikornToast({
        delay: 1
      })
      .appendTo($('#qunit-fixture'))

    $toast.on('shown.uni.toast', function () {
      assert.strictEqual($toast.hasClass('show'), true)
      done()
    })
      .unikornToast('show')
  })

  test('should close toast when close element with data-dismiss attribute is set', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="1" data-autohide="false" data-animation="false">' +
        '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast">' +
          'close' +
        '</button>' +
      '</div>'

    var $toast = $(toastHtml)
      .unikornToast()
      .appendTo($('#qunit-fixture'))

    $toast
      .on('shown.uni.toast', function () {
        assert.strictEqual($toast.hasClass('show'), true)
        var button = $toast.find('.close')
        button.trigger('click')
      })
      .on('hidden.uni.toast', function () {
        assert.strictEqual($toast.hasClass('show'), false)
        done()
      })
      .unikornToast('show')
  })

  // test('should expose default setting to allow to override them', (assert) => {
  //   assert.expect(1)

  //   var defaultDelay = 1000
  //   Toast.Default.delay = defaultDelay

  //   var toastHtml =
  //     '<div class="toast" data-autohide="false" data-animation="false">' +
  //     '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast">' +
  //     'close' +
  //     '</button>' +
  //     '</div>'

  //   var $toast = $(toastHtml)
  //     .unikornToast()

  //   var toast = $toast.data('uni.toast')
  //   assert.strictEqual(toast._config.delay, defaultDelay)
  // })

  test('should not trigger shown if show is prevented', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="1" data-autohide="false">' +
      '<div class="toast-body">' +
      'a simple toast' +
      '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .unikornToast()
      .appendTo($('#qunit-fixture'))

    var shownCalled = false
    function assertDone() {
      setTimeout(function () {
        assert.strictEqual(shownCalled, false)
        done()
      }, 20)
    }

    $toast
      .on('show.uni.toast', function (event) {
        event.preventDefault()
        assertDone()
      })
      .on('shown.uni.toast', function () {
        shownCalled = true
      })
      .unikornToast('show')
  })

  test('should not trigger hidden if hide is prevented', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="1" data-autohide="false">' +
      '<div class="toast-body">' +
      'a simple toast' +
      '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .unikornToast()
      .appendTo($('#qunit-fixture'))

    var hiddenCalled = false
    function assertDone() {
      setTimeout(function () {
        assert.strictEqual(hiddenCalled, false)
        done()
      }, 20)
    }

    $toast
      .on('shown.uni.toast', function () {
        $toast.unikornToast('hide')
      })
      .on('hide.uni.toast', function (event) {
        event.preventDefault()
        assertDone()
      })
      .on('hidden.uni.toast', function () {
        hiddenCalled = true
      })
      .unikornToast('show')
  })
})
