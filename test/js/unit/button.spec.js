$(function () {
  'use strict'

  const { module, test } = QUnit

  window.Button = typeof unikorn !== 'undefined' ? unikorn.Button : Button

  module('button plugin', () => {
    test('should be defined on jquery object', (assert) => {
      assert.expect(1)
      assert.ok($(document.body).button, 'button method is defined')
    })
  })

  module('button', {
    beforeEach: () => {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.unikornButton = $.fn.button.noConflict()
    },
    afterEach: () => {
      $.fn.button = $.fn.unikornButton
      delete $.fn.unikornButton
      $('#qunit-fixture').html('')
    }
  })

  test('should provide no conflict', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.button, 'undefined', 'button was set back to undefined (org value)')
  })

  test('should return button version', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof Button.VERSION, 'string')
  })

  test('should return jquery collection containing the element', (assert) => {
    assert.expect(2)

    var $el = $('<div/>')
    var $button = $el.unikornButton()

    assert.ok($button instanceof $, 'returns jquery collection')
    assert.strictEqual($button[0], $el[0], 'collection contains element')
  })

  test('should toggle active', (assert) => {
    assert.expect(2)

    var $btn = $('<button class="btn" data-toggle="button">mdo</button>')
    assert.ok(!$btn.hasClass('active'), 'btn does not have active class')

    $btn.unikornButton('toggle')
    assert.ok($btn.hasClass('active'), 'btn has class active')
  })

  test('should toggle active when btn children are clicked', (assert) => {
    assert.expect(2)

    var $btn = $('<button class="btn" data-toggle="button">mdo</button>')
    var $inner = $('<i/>')

    $btn.append($inner).appendTo('#qunit-fixture')
    assert.ok(!$btn.hasClass('active'), 'btn does not have active class')

    $inner.trigger('click')
    assert.ok($btn.hasClass('active'), 'btn has class active')
  })

  test('should toggle aria-pressed', (assert) => {
    assert.expect(2)

    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false">redux</button>')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is false')

    $btn.unikornButton('toggle')
    assert.strictEqual($btn.attr('aria-pressed'), 'true', 'btn aria-pressed state is true')
  })

  // test('should not toggle aria-pressed on buttons with disabled class', function (assert) {
  //   assert.expect(2)

  //   var $btn = $('<button class="btn disabled" data-toggle="button" aria-pressed="false">redux</button>')
  //   assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is false')

  //   $btn.unikornButton('toggle')
  //   assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is still false')
  // })

  // test('should not toggle aria-pressed on buttons that are disabled', (assert) => {
  //   assert.expect(2)

  //   var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false" disabled>redux</button>')
  //   assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is false')

  //   $btn.unikornButton('toggle')
  //   assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is still false')
  // })

  test('should toggle aria-pressed on buttons with container', (assert) => {
    assert.expect(1)

    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
        '<button id="btn1" class="btn btn-secondary" type="button">One</button>' +
        '<button class="btn btn-secondary" type="button">Two</button>' +
        '</div>'
    $('#qunit-fixture').append(groupHTML)

    $('#btn1').unikornButton('toggle')
    assert.strictEqual($('#btn1').attr('aria-pressed'), 'true')
  })

  test('should toggle aria-pressed when btn children are clicked', (assert) => {
    assert.expect(2)

    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false">redux</button>')
    var $inner = $('<i/>')

    $btn.append($inner).appendTo('#qunit-fixture')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is false')

    $inner.trigger('click')
    assert.strictEqual($btn.attr('aria-pressed'), 'true', 'btn aria-pressed state is true')
  })

  test('should trigger input change event when toggled button has input field', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
        '<label class="btn btn-primary">' +
        '<input type="radio" id="radio" autocomplete="off">Radio' +
        '</label>' +
        '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    $group.find('input').on('change', function (e) {
      e.preventDefault()
      assert.ok(true, 'change event fired')
      done()
    })

    $group.find('label').trigger('click')
  })

  test('should check for closest matching toggle', (assert) => {
    assert.expect(12)

    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
        '<label class="btn btn-primary active">' +
        '<input type="radio" name="options" id="option1" checked="true"> Option 1' +
        '</label>' +
        '<label class="btn btn-primary">' +
        '<input type="radio" name="options" id="option2"> Option 2' +
        '</label>' +
        '<label class="btn btn-primary">' +
        '<input type="radio" name="options" id="option3"> Option 3' +
        '</label>' +
        '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $btn1 = $group.children().eq(0)
    var $btn2 = $group.children().eq(1)

    assert.ok($btn1.hasClass('active'), 'btn1 has active class')
    assert.ok($btn1.find('input').prop('checked'), 'btn1 is checked')
    assert.ok(!$btn2.hasClass('active'), 'btn2 does not have active class')
    assert.ok(!$btn2.find('input').prop('checked'), 'btn2 is not checked')

    $btn2.find('input').trigger('click')
    assert.ok(!$btn1.hasClass('active'), 'btn1 does not have active class')
    assert.ok(!$btn1.find('input').prop('checked'), 'btn1 is not checked')
    assert.ok($btn2.hasClass('active'), 'btn2 has active class')
    assert.ok($btn2.find('input').prop('checked'), 'btn2 is checked')

    $btn2.find('input').trigger('click') // Clicking an already checked radio should not un-check it
    assert.ok(!$btn1.hasClass('active'), 'btn1 does not have active class')
    assert.ok(!$btn1.find('input').prop('checked'), 'btn1 is not checked')
    assert.ok($btn2.hasClass('active'), 'btn2 has active class')
    assert.ok($btn2.find('input').prop('checked'), 'btn2 is checked')
  })

  test('should only toggle selectable inputs', (assert) => {
    assert.expect(6)

    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn btn-primary active">' +
      '<input type="hidden" name="option1" id="option1-default" value="false">' +
      '<input type="checkbox" name="option1" id="option1" checked="true"> Option 1' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $btn = $group.children().eq(0)
    var $hidden = $btn.find('input#option1-default')
    var $cb = $btn.find('input#option1')

    assert.ok($btn.hasClass('active'), 'btn has active class')
    assert.ok($cb.prop('checked'), 'btn is checked')
    assert.ok(!$hidden.prop('checked'), 'hidden is not checked')
    $btn.trigger('click')
    assert.ok(!$btn.hasClass('active'), 'btn does not have active class')
    assert.ok(!$cb.prop('checked'), 'btn is not checked')
    assert.ok(!$hidden.prop('checked'), 'hidden is not checked') // should not be changed
  })

  test('should not add aria-pressed on labels for radio/checkbox inputs in a data-toggle="buttons" group', (assert) => {
    assert.expect(2)

    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
        '<label class="btn btn-primary"><input type="checkbox" autocomplete="off"> Checkbox</label>' +
        '<label class="btn btn-primary"><input type="radio" name="options" autocomplete="off"> Radio</label>' +
        '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $btn1 = $group.children().eq(0)
    var $btn2 = $group.children().eq(1)

    $btn1.find('input').trigger('click')
    assert.ok($btn1.is(':not([aria-pressed])'), 'label for nested checkbox input has not been given an aria-pressed attribute')

    $btn2.find('input').trigger('click')
    assert.ok($btn2.is(':not([aria-pressed])'), 'label for nested radio input has not been given an aria-pressed attribute')
  })

  // test('should handle disabled attribute on non-button elements', (assert) => {
  //   assert.expect(2)

  //   var groupHTML = '<div class="btn-group disabled" data-toggle="buttons" aria-disabled="true" disabled>' +
  //       '<label class="btn btn-danger disabled">' +
  //       '<input type="checkbox" aria-disabled="true" autocomplete="off" disabled>' +
  //       '</label>' +
  //       '</div>'
  //   var $group = $(groupHTML).appendTo('#qunit-fixture')

  //   var $btn = $group.children().eq(0)
  //   var $input = $btn.children().eq(0)

  //   assert.ok($btn.is(':not(.active)'), 'button is initially not active')
  //   assert.ok(!$input.prop('checked'), 'checkbox is initially not checked')
  //   $btn[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
  //   assert.ok($btn.is(':not(.active)'), 'button did not become active')
  //   assert.ok(!$input.prop('checked'), 'checkbox did not get checked')
  // })

  test('should not set active class if inner hidden checkbox is disabled but author forgot to set disabled class on outer button', (assert) => {
    assert.expect(4)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn btn-danger">' +
      '<input type="checkbox" autocomplete="off" disabled>' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $btn = $group.children().eq(0)
    var $input = $btn.children().eq(0)

    assert.ok($btn.is(':not(.active)'), 'button is initially not active')
    assert.ok(!$input.prop('checked'), 'checkbox is initially not checked')
    $btn[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
    assert.ok($btn.is(':not(.active)'), 'button did not become active')
    assert.ok(!$input.prop('checked'), 'checkbox did not get checked')
  })

  test('should correctly set checked state on input and active class on label when using <label><input></label> structure', (assert) => {
    assert.expect(4)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn">' +
      '<input type="checkbox" autocomplete="off">' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $label = $group.children().eq(0)
    var $input = $label.children().eq(0)

    assert.ok($label.is(':not(.active)'), 'label is initially not active')
    assert.ok(!$input.prop('checked'), 'checkbox is initially not checked')
    $label[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
    assert.ok($label.is('.active'), 'label is active after click')
    assert.ok($input.prop('checked'), 'checkbox is checked after click')
  })

  test('should correctly set checked state on input and active class on the faked button when using <div><input></div> structure', (assert) => {
    assert.expect(4)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<div class="btn">' +
      '<input type="checkbox" autocomplete="off" aria-label="Check">' +
      '</div>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $btn = $group.children().eq(0)
    var $input = $btn.children().eq(0)

    assert.ok($btn.is(':not(.active)'), '<div> is initially not active')
    assert.ok(!$input.prop('checked'), 'checkbox is initially not checked')
    $btn[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
    assert.ok($btn.is('.active'), '<div> is active after click')
    assert.ok($input.prop('checked'), 'checkbox is checked after click')
  })

  test('should not do anything if the click was just sent to the outer container with data-toggle', (assert) => {
    assert.expect(4)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn">' +
      '<input type="checkbox" autocomplete="off">' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $label = $group.children().eq(0)
    var $input = $label.children().eq(0)

    assert.ok($label.is(':not(.active)'), 'label is initially not active')
    assert.ok(!$input.prop('checked'), 'checkbox is initially not checked')
    $group[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
    assert.ok($label.is(':not(.active)'), 'label is not active after click')
    assert.ok(!$input.prop('checked'), 'checkbox is not checked after click')
  })

  test('should not try and set checked property on an input of type="hidden"', (assert) => {
    assert.expect(2)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn">' +
      '<input type="hidden" autocomplete="off">' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $label = $group.children().eq(0)
    var $input = $label.children().eq(0)

    assert.ok(!$input.prop('checked'), 'hidden input initially has no checked property')
    $label[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
    assert.ok(!$input.prop('checked'), 'hidden input does not have a checked property')
  })

  // test('should not try and set checked property on an input that is not a radio button or checkbox', (assert) => {
  //   assert.expect(2)
  //   var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
  //     '<label class="btn">' +
  //     '<input type="text" autocomplete="off">' +
  //     '</label>' +
  //     '</div>'
  //   var $group = $(groupHTML).appendTo('#qunit-fixture')

  //   var $label = $group.children().eq(0)
  //   var $input = $label.children().eq(0)

  //   assert.ok(!$input.prop('checked'), 'text input initially has no checked property')
  //   $label[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
  //   assert.ok(!$input.prop('checked'), 'text input does not have a checked property')
  // })

  test('dispose should remove data and the element', (assert) => {
    assert.expect(2)

    var $el = $('<div/>')
    var $button = $el.unikornButton()

    assert.ok(typeof $button.data('uni.button') !== 'undefined')

    $button.data('uni.button').dispose()

    assert.ok(typeof $button.data('uni.button') === 'undefined')
  })
})