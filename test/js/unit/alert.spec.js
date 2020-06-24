/**
 * UniKorn (v1.1.0): alert.spec.js
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * -------------------------------------------------------------------------- */

$(() => {
  const { module, test } = QUnit

  window.Alert = typeof unikorn !== 'undefined' ? unikorn.Alert : Alert

  module('alert plugin', () => {
    test('should return `Alert` plugin version', (assert) => {
      assert.expect(1)
      assert.strictEqual(typeof Alert.VERSION, 'string')
    })

    test('should be defined on jquery object', (assert) => {
      assert.expect(1)
      assert.ok($(document.body).alert, 'alert method is defined')
    })
  })

  module('alert', {
    beforeEach: () => {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.unikornAlert = $.fn.alert.noConflict()
    },
    afterEach: () => {
      $.fn.alert = $.fn.unikornAlert
      delete $.fn.unikornAlert
      $('#qunit-fixture').html('')
    }
  })

  test('should provide no conflict', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.alert, 'undefined', 'alert was set back to undefined (org value)')
  })

  test('should return jquery collection containing the element', (assert) => {
    assert.expect(2)

    var $el = $('<div/>')
    var $alert = $el.unikornAlert()

    assert.ok($alert instanceof $, 'returns jquery collection')
    assert.strictEqual($alert[0], $el[0], 'collection contains element')
  })

  test('should fade element out on clicking .close', (assert) => {
    assert.expect(1)

    var alertHTML = '<div class="alert alert-danger fade show">' +
        '<a class="close" href="#" data-dismiss="alert">×</a>' +
        '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
        '</div>'
    var $alert = $(alertHTML).unikornAlert().appendTo($('#qunit-fixture'))

    $alert.find('.close').trigger('click')
    assert.strictEqual($alert.hasClass('show'), false, 'remove .show class on .close click')
  })

  test('should remove element when clicking .close', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var alertHTML = '<div class="alert alert-danger fade show">' +
        '<a class="close" href="#" data-dismiss="alert">×</a>' +
        '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
        '</div>'
    var $alert = $(alertHTML).appendTo('#qunit-fixture').unikornAlert()

    assert.notStrictEqual($('#qunit-fixture').find('.alert').length, 0, 'element added to dom')

    $alert
      .one('closed.uni.alert', function () {
        assert.strictEqual($('#qunit-fixture').find('.alert').length, 0, 'element removed from dom')
        done()
      })
      .find('.close')
      .trigger('click')
  })

  test('should not fire closed when close is prevented', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div class="alert"/>')
      .on('close.uni.alert', function (e) {
        e.preventDefault()
        assert.ok(true, 'close event fired')
        done()
      })
      .on('closed.uni.alert', function () {
        assert.ok(false, 'closed event fired')
      })
      .unikornAlert('close')
  })

  test('close should use internal _element if no element provided', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $el = $('<div/>')
    var $alert = $el.unikornAlert()
    var alertInstance = $alert.data('uni.alert')

    $alert.one('closed.uni.alert', function () {
      assert.ok('alert closed')
      done()
    })

    alertInstance.close()
  })

  test('dispose should remove data and the element', (assert) => {
    assert.expect(2)

    var $el = $('<div/>')
    var $alert = $el.unikornAlert()

    assert.ok(typeof $alert.data('uni.alert') !== 'undefined')

    $alert.data('uni.alert').dispose()

    assert.ok(typeof $alert.data('uni.button') === 'undefined')
  })
})
