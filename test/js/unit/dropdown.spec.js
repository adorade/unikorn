$(function () {
  'use strict'

  const { module, test } = QUnit

  window.Dropdown = typeof unikorn !== 'undefined' ? unikorn.Dropdown : Dropdown

  module('dropdowns plugin', () => {
    test('should be defined on jquery object', (assert) => {
      assert.expect(1)
      assert.ok($(document.body).dropdown, 'dropdown method is defined')
    })
  })

  module('dropdowns', {
    beforeEach: () => {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.unikornDropdown = $.fn.dropdown.noConflict()
    },
    afterEach: () => {
      $.fn.dropdown = $.fn.unikornDropdown
      delete $.fn.unikornDropdown
      $('#qunit-fixture').html('')
    }
  })

  test('should provide no conflict', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.dropdown, 'undefined', 'dropdown was set back to undefined (org value)')
  })

  test('should return dropdown version', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof Dropdown.VERSION, 'string')
  })

  test('should throw explicit error on undefined method', (assert) => {
    assert.expect(1)

    var $el = $('<div/>')

    $el.unikornDropdown()
    try {
      $el.unikornDropdown('noMethod')
    } catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  test('should return jquery collection containing the element', (assert) => {
    assert.expect(2)

    var $el = $('<div/>')
    var $dropdown = $el.unikornDropdown()

    assert.ok($dropdown instanceof $, 'returns jquery collection')
    assert.strictEqual($dropdown[0], $el[0], 'collection contains element')
  })

  test('should not open dropdown if target is disabled via attribute', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown.on('click', function () {
      assert.ok(!$dropdown.parent('.dropdown').hasClass('show'))
      done()
    })

    $dropdown.trigger($.Event('click'))
  })

  test('should not add class position-static to dropdown if boundary not set', (assert) => {
    assert.expect(1)
    var done = assert.async()
    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.ok(!$dropdown.parent('.dropdown').hasClass('position-static'), '"position-static" class not added')
        done()
      })
    $dropdown.trigger('click')
  })

  test('should add class position-static to dropdown if boundary not scrollParent', (assert) => {
    assert.expect(1)
    var done = assert.async()
    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-boundary="viewport">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.ok($dropdown.parent('.dropdown').hasClass('position-static'), '"position-static" class added')
        done()
      })
    $dropdown.trigger('click')
  })

  test('should set aria-expanded="true" on target when dropdown menu is shown', (assert) => {
    assert.expect(1)
    var done = assert.async()
    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.strictEqual($dropdown.attr('aria-expanded'), 'true', 'aria-expanded is set to string "true" on click')
        done()
      })
    $dropdown.trigger('click')
  })

  test('should set aria-expanded="false" on target when dropdown menu is hidden', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" aria-expanded="false" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .parent('.dropdown')
      .on('hidden.uni.dropdown', function () {
        assert.strictEqual($dropdown.attr('aria-expanded'), 'false', 'aria-expanded is set to string "false" on hide')
        done()
      })

    $dropdown.trigger('click')
    $(document.body).trigger('click')
  })

  test('should not open dropdown if target is disabled via class', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<button href="#" class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .on('click', function () {
        assert.ok(!$dropdown.parent('.dropdown').hasClass('show'))
        done()
      })

    $dropdown.trigger($.Event('click'))
  })

  test('should add class show to menu if clicked', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), '"show" class added on click')
        done()
      })

    $dropdown.trigger('click')
  })

  test('should remove "show" class if body is clicked', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), '"show" class added on click')
        $(document.body).trigger('click')
      }).on('hidden.uni.dropdown', function () {
        assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), '"show" class removed')
        done()
      })

    $dropdown.trigger('click')
  })

  test('should remove "show" class if tabbing outside of menu', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="dropdown-divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), '"show" class added on click')
        var e = $.Event('keyup')
        e.which = 9 // Tab
        $(document.body).trigger(e)
      }).on('hidden.uni.dropdown', function () {
        assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), '"show" class removed')
        done()
      })

    $dropdown.trigger('click')
  })

  test('should remove "show" class if body is clicked, with multiple dropdowns', (assert) => {
    assert.expect(7)
    var done = assert.async()

    var dropdownHTML = '<div class="nav">' +
        '<div class="dropdown" id="testmenu">' +
        '<a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu <span class="caret"/></a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#sub1">Submenu 1</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="btn-group">' +
        '<button class="btn">Actions</button>' +
        '<button class="btn dropdown-toggle" data-toggle="dropdown"></button>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Action 1</a>' +
        '</div>' +
        '</div>'
    var $dropdowns = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
    var $first = $dropdowns.first()
    var $last = $dropdowns.last()

    assert.strictEqual($dropdowns.length, 2, 'two dropdowns')

    $first.parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.strictEqual($first.parents('.show').length, 1, '"show" class added on click')
        assert.strictEqual($('#qunit-fixture .dropdown-menu.show').length, 1, 'only one dropdown is shown')
        $(document.body).trigger('click')
      }).on('hidden.uni.dropdown', function () {
        assert.strictEqual($('#qunit-fixture .dropdown-menu.show').length, 0, '"show" class removed')
        $last.trigger('click')
      })

    $last.parent('.btn-group')
      .on('shown.uni.dropdown', function () {
        assert.strictEqual($last.parent('.show').length, 1, '"show" class added on click')
        assert.strictEqual($('#qunit-fixture .dropdown-menu.show').length, 1, 'only one dropdown is shown')
        $(document.body).trigger('click')
      }).on('hidden.uni.dropdown', function () {
        assert.strictEqual($('#qunit-fixture .dropdown-menu.show').length, 0, '"show" class removed')
        done()
      })
    $first.trigger('click')
  })

  test('should remove "show" class if body if tabbing outside of menu, with multiple dropdowns', (assert) => {
    assert.expect(7)
    var done = assert.async()

    var dropdownHTML = '<div class="nav">' +
        '<div class="dropdown" id="testmenu">' +
        '<a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu <span class="caret"/></a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#sub1">Submenu 1</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="btn-group">' +
        '<button class="btn">Actions</button>' +
        '<button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"/></button>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Action 1</a>' +
        '</div>' +
        '</div>'
    var $dropdowns = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-toggle="dropdown"]')
    var $first = $dropdowns.first()
    var $last = $dropdowns.last()

    assert.strictEqual($dropdowns.length, 2, 'two dropdowns')

    $first.parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.strictEqual($first.parents('.show').length, 1, '"show" class added on click')
        assert.strictEqual($('#qunit-fixture .dropdown-menu.show').length, 1, 'only one dropdown is shown')
        var e = $.Event('keyup')
        e.which = 9 // Tab
        $(document.body).trigger(e)
      }).on('hidden.uni.dropdown', function () {
        assert.strictEqual($('#qunit-fixture .dropdown-menu.show').length, 0, '"show" class removed')
        $last.trigger('click')
      })

    $last.parent('.btn-group')
      .on('shown.uni.dropdown', function () {
        assert.strictEqual($last.parent('.show').length, 1, '"show" class added on click')
        assert.strictEqual($('#qunit-fixture .dropdown-menu.show').length, 1, 'only one dropdown is shown')
        var e = $.Event('keyup')
        e.which = 9 // Tab
        $(document.body).trigger(e)
      }).on('hidden.uni.dropdown', function () {
        assert.strictEqual($('#qunit-fixture .dropdown-menu.show').length, 0, '"show" class removed')
        done()
      })
    $first.trigger('click')
  })

  test('should fire show and hide event', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .parent('.dropdown')
      .on('show.uni.dropdown', function () {
        assert.ok(true, 'show was fired')
      })
      .on('hide.uni.dropdown', function () {
        assert.ok(true, 'hide was fired')
        done()
      })

    $dropdown.trigger('click')
    $(document.body).trigger('click')
  })

  test('should fire shown and hidden event', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.ok(true, 'shown was fired')
      })
      .on('hidden.uni.dropdown', function () {
        assert.ok(true, 'hidden was fired')
        done()
      })

    $dropdown.trigger('click')
    $(document.body).trigger('click')
  })

  test('should fire shown and hidden event with a relatedTarget', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown.parent('.dropdown')
      .on('hidden.uni.dropdown', function (e) {
        assert.strictEqual(e.relatedTarget, $dropdown[0])
        done()
      })
      .on('shown.uni.dropdown', function (e) {
        assert.strictEqual(e.relatedTarget, $dropdown[0])
        $(document.body).trigger('click')
      })

    $dropdown.trigger('click')
  })

  test('should fire hide and hidden event with a clickEvent', (assert) => {
    assert.expect(3)

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .parent('.dropdown')
      .on('hide.uni.dropdown', function (e) {
        assert.ok(e.clickEvent)
      })
      .on('hidden.uni.dropdown', function (e) {
        assert.ok(e.clickEvent)
      })
      .on('shown.uni.dropdown', function () {
        assert.ok(true, 'shown was fired')
        $(document.body).trigger('click')
      })

    $dropdown.trigger('click')
  })

  test('should fire hide and hidden event without a clickEvent if event type is not click', (assert) => {
    assert.expect(3)

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown.parent('.dropdown')
      .on('hide.uni.dropdown', function (e) {
        assert.notOk(e.clickEvent)
      })
      .on('hidden.uni.dropdown', function (e) {
        assert.notOk(e.clickEvent)
      })
      .on('shown.uni.dropdown', function () {
        assert.ok(true, 'shown was fired')
        $dropdown.trigger($.Event('keydown', {
          which: 27
        }))
      })

    $dropdown.trigger('click')
  })

  test('should ignore keyboard events within <input>s and <textarea>s', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '<input type="text" id="input">' +
        '<textarea id="textarea"/>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var $input = $('#input')
    var $textarea = $('#textarea')

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.ok(true, 'shown was fired')

        $input.trigger('focus').trigger($.Event('keydown', {
          which: 38
        }))
        assert.ok($(document.activeElement).is($input), 'input still focused')

        $textarea.trigger('focus').trigger($.Event('keydown', {
          which: 38
        }))
        assert.ok($(document.activeElement).is($textarea), 'textarea still focused')

        done()
      })

    $dropdown.trigger('click')
  })

  test('should skip disabled element when using keyboard navigation', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item disabled" href="#">Disabled link</a>' +
        '<button class="dropdown-item" type="button" disabled>Disabled button</button>' +
        '<a id="item1" class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.ok(true, 'shown was fired')
        $dropdown.trigger($.Event('keydown', {
          which: 40
        }))
        $dropdown.trigger($.Event('keydown', {
          which: 40
        }))
        assert.ok(!$(document.activeElement).is('.disabled'), '.disabled is not focused')
        assert.ok(!$(document.activeElement).is(':disabled'), ':disabled is not focused')
        done()
      })

    $dropdown.trigger('click')
  })

  test('should focus next/previous element when using keyboard navigation', (assert) => {
    assert.expect(4)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a id="item1" class="dropdown-item" href="#">A link</a>' +
        '<a id="item2" class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.ok(true, 'shown was fired')
        $dropdown.trigger($.Event('keydown', {
          which: 40
        }))
        assert.ok($(document.activeElement).is($('#item1')), 'item1 is focused')

        $(document.activeElement).trigger($.Event('keydown', {
          which: 40
        }))
        assert.ok($(document.activeElement).is($('#item2')), 'item2 is focused')

        $(document.activeElement).trigger($.Event('keydown', {
          which: 38
        }))
        assert.ok($(document.activeElement).is($('#item1')), 'item1 is focused')
        done()
      })

    $dropdown.trigger('click')
  })

  test('should not close the dropdown if the user clicks on a text field', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var dropdownHTML = '<div class="dropdown">' +
        '<button type="button" data-toggle="dropdown">Dropdown</button>' +
        '<div class="dropdown-menu">' +
        '<input id="textField" type="text" />' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var $textfield = $('#textField')

    $textfield
      .on('click', function () {
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
        done()
      })

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
        $textfield.trigger($.Event('click'))
      })

    $dropdown.trigger('click')
  })

  test('should not close the dropdown if the user clicks on a textarea', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var dropdownHTML = '<div class="dropdown">' +
        '<button type="button" data-toggle="dropdown">Dropdown</button>' +
        '<div class="dropdown-menu">' +
        '<textarea id="textArea"></textarea>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var $textarea = $('#textArea')

    $textarea
      .on('click', function () {
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
        done()
      })

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
        $textarea.trigger($.Event('click'))
      })

    $dropdown.trigger('click')
  })

  test('Dropdown should not use Popper.js in navbar', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var html = '<nav class="navbar navbar-expand-md navbar-light bg-light">' +
        '<div class="dropdown">' +
        '<a class="nav-link dropdown-toggle" href="#" id="dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>' +
        '<div class="dropdown-menu" aria-labelledby="dropdown">' +
        '<a class="dropdown-item" href="#">Action</a>' +
        '<a class="dropdown-item" href="#">Another action</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '</div>' +
        '</div>' +
        '</nav>'

    $(html).appendTo('#qunit-fixture')
    var $triggerDropdown = $('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var $dropdownMenu = $triggerDropdown.next()

    $triggerDropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        assert.ok(typeof $dropdownMenu.attr('style') === 'undefined', 'No inline style applied by Popper.js')
        done()
      })

    $triggerDropdown.trigger($.Event('click'))
  })

  test('should ignore keyboard events for <input>s and <textarea>s within dropdown-menu, except for escape key', (assert) => {
    assert.expect(7)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '<input type="text" id="input">' +
        '<textarea id="textarea"/>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var $input = $('#input')
    var $textarea = $('#textarea')

    $dropdown
      .parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        // Space key
        $input.trigger('focus').trigger($.Event('keydown', {
          which: 32
        }))
        assert.ok($(document.activeElement)[0] === $input[0], 'input still focused')
        $textarea.trigger('focus').trigger($.Event('keydown', {
          which: 32
        }))
        assert.ok($(document.activeElement)[0] === $textarea[0], 'textarea still focused')

        // Key up
        $input.trigger('focus').trigger($.Event('keydown', {
          which: 38
        }))
        assert.ok($(document.activeElement)[0] === $input[0], 'input still focused')
        $textarea.trigger('focus').trigger($.Event('keydown', {
          which: 38
        }))
        assert.ok($(document.activeElement)[0] === $textarea[0], 'textarea still focused')

        // Key down
        $input.trigger('focus').trigger($.Event('keydown', {
          which: 40
        }))
        assert.ok($(document.activeElement)[0] === $input[0], 'input still focused')
        $textarea.trigger('focus').trigger($.Event('keydown', {
          which: 40
        }))
        assert.ok($(document.activeElement)[0] === $textarea[0], 'textarea still focused')

        // Key escape
        $input.trigger('focus').trigger($.Event('keydown', {
          which: 27
        }))
        assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is not shown')
        done()
      })

    $dropdown.trigger('click')
  })

  test('should ignore space key events for <input>s within dropdown, and accept up, down and escape', (assert) => {
    assert.expect(6)
    var done = assert.async()

    var dropdownHTML = '<ul class="nav tabs">' +
        '<li class="dropdown">' +
        '<input type="text" id="input" data-toggle="dropdown">' +
        '<div class="dropdown-menu" role="menu">' +
        '<a id="item1" class="dropdown-item" href="#">Secondary link</a>' +
        '<a id="item2" class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"></div>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</li>' +
        '</ul>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var $input = $('#input')

    $dropdown
      .parent('.dropdown')
      .one('shown.uni.dropdown', function () {
        assert.ok(true, 'shown was fired')

        // Key space
        $input.trigger('focus').trigger($.Event('keydown', {
          which: 32
        }))
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
        assert.ok($(document.activeElement).is($input), 'input is still focused')

        // Key escape
        $input.trigger('focus').trigger($.Event('keydown', {
          which: 27
        }))
        assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is not shown')

        $dropdown
          .parent('.dropdown')
          .one('shown.uni.dropdown', function () {
            // Key down
            $input.trigger('focus').trigger($.Event('keydown', {
              which: 40
            }))
            assert.ok(document.activeElement === $('#item1')[0], 'item1 is focused')

            $dropdown
              .parent('.dropdown')
              .one('shown.uni.dropdown', function () {
                // Key up
                $input.trigger('focus').trigger($.Event('keydown', {
                  which: 38
                }))
                assert.ok(document.activeElement === $('#item1')[0], 'item1 is focused')
                done()
              }).unikornDropdown('toggle')
            $input.trigger('click')
          })
        $input.trigger('click')
      })
    $input.trigger('click')
  })

  test('should ignore space key events for <textarea>s within dropdown, and accept up, down and escape', (assert) => {
    assert.expect(6)
    var done = assert.async()

    var dropdownHTML = '<ul class="nav tabs">' +
        '<li class="dropdown">' +
        '<textarea id="textarea" data-toggle="dropdown"></textarea>' +
        '<div class="dropdown-menu" role="menu">' +
        '<a id="item1" class="dropdown-item" href="#">Secondary link</a>' +
        '<a id="item2" class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"></div>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</li>' +
        '</ul>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var $textarea = $('#textarea')

    $dropdown
      .parent('.dropdown')
      .one('shown.uni.dropdown', function () {
        assert.ok(true, 'shown was fired')

        // Key space
        $textarea.trigger('focus').trigger($.Event('keydown', {
          which: 32
        }))
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
        assert.ok($(document.activeElement).is($textarea), 'textarea is still focused')

        // Key escape
        $textarea.trigger('focus').trigger($.Event('keydown', {
          which: 27
        }))
        assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is not shown')

        $dropdown
          .parent('.dropdown')
          .one('shown.uni.dropdown', function () {
            // Key down
            $textarea.trigger('focus').trigger($.Event('keydown', {
              which: 40
            }))
            assert.ok(document.activeElement === $('#item1')[0], 'item1 is focused')

            $dropdown
              .parent('.dropdown')
              .one('shown.uni.dropdown', function () {
                // Key up
                $textarea.trigger('focus').trigger($.Event('keydown', {
                  which: 38
                }))
                assert.ok(document.activeElement === $('#item1')[0], 'item1 is focused')
                done()
              }).unikornDropdown('toggle')
            $textarea.trigger('click')
          })
        $textarea.trigger('click')
      })
    $textarea.trigger('click')
  })

  test('should not use Popper.js if display set to static', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var dropdownHTML = '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-display="static">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()
    var dropdownMenu = $dropdown.next()[0]

    $dropdown.parent('.dropdown')
      .on('shown.uni.dropdown', function () {
        // Popper.js add this attribute when we use it
        assert.strictEqual(dropdownMenu.getAttribute('x-placement'), null)
        done()
      })

    $dropdown.trigger('click')
  })

  test('should call Popper.js and detect navbar on update', (assert) => {
    assert.expect(3)

    var dropdownHTML = '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var dropdown = $dropdown.data('uni.dropdown')
    dropdown.toggle()
    assert.ok(dropdown._popper)

    var spyPopper = sinon.spy(dropdown._popper, 'scheduleUpdate')
    var spyDetectNavbar = sinon.spy(dropdown, '_detectNavbar')
    dropdown.update()

    assert.ok(spyPopper.called)
    assert.ok(spyDetectNavbar.called)
  })

  test('should just detect navbar on update', (assert) => {
    assert.expect(2)

    var dropdownHTML = '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var dropdown = $dropdown.data('uni.dropdown')
    var spyDetectNavbar = sinon.spy(dropdown, '_detectNavbar')

    dropdown.update()

    assert.notOk(dropdown._popper)
    assert.ok(spyDetectNavbar.called)
  })

  test('should dispose dropdown with Popper', (assert) => {
    assert.expect(6)

    var dropdownHTML = '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var dropdown = $dropdown.data('uni.dropdown')
    dropdown.toggle()

    assert.ok(dropdown._popper)
    assert.ok(dropdown._menu !== null)
    assert.ok(dropdown._element !== null)
    var spyDestroy = sinon.spy(dropdown._popper, 'destroy')

    dropdown.dispose()

    assert.ok(spyDestroy.called)
    assert.ok(dropdown._menu === null)
    assert.ok(dropdown._element === null)
  })

  test('should dispose dropdown', (assert) => {
    assert.expect(5)

    var dropdownHTML = '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var dropdown = $dropdown.data('uni.dropdown')

    assert.notOk(dropdown._popper)
    assert.ok(dropdown._menu !== null)
    assert.ok(dropdown._element !== null)

    dropdown.dispose()

    assert.ok(dropdown._menu === null)
    assert.ok(dropdown._element === null)
  })

  test('should show dropdown', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var dropdownHTML = '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var dropdown = $dropdown.data('uni.dropdown')

    $dropdown
      .parent('.dropdown')
      .on('show.uni.dropdown', function () {
        assert.ok(true, 'show was fired')
      })
      .on('shown.uni.dropdown', function () {
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
        done()
      })

    dropdown.show()
  })

  test('should hide dropdown', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var dropdownHTML = '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var dropdown = $dropdown.data('uni.dropdown')
    $dropdown.trigger('click')

    $dropdown
      .parent('.dropdown')
      .on('hide.uni.dropdown', function () {
        assert.ok(true, 'hide was fired')
      })
      .on('hidden.uni.dropdown', function () {
        assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is hidden')
        done()
      })

    dropdown.hide()
  })

  test('should not hide dropdown', (assert) => {
    assert.expect(1)

    var dropdownHTML = '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var dropdown = $dropdown.data('uni.dropdown')
    $dropdown.trigger('click')
    dropdown.show()

    assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is still shown')
  })

  test('should not show dropdown', (assert) => {
    assert.expect(1)

    var dropdownHTML = '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var dropdown = $dropdown.data('uni.dropdown')
    dropdown.hide()
    assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is still hidden')
  })

  test('should show dropdown', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var dropdownHTML = '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var dropdown = $dropdown.data('uni.dropdown')

    $dropdown
      .parent('.dropdown')
      .on('show.uni.dropdown', function () {
        assert.ok(true, 'show was fired')
      })
      .on('shown.uni.dropdown', function () {
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
        done()
      })

    dropdown.show()
  })

  test('should prevent default event on show method call', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var dropdownHTML = '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var dropdown = $dropdown.data('uni.dropdown')

    $dropdown
      .parent('.dropdown')
      .on('show.uni.dropdown', function (event) {
        event.preventDefault()
        done()
      })

    dropdown.show()
    assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is hidden')
  })

  test('should prevent default event on hide method call', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var dropdownHTML = '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    var dropdown = $dropdown.data('uni.dropdown')
    $dropdown.trigger('click')

    $dropdown
      .parent('.dropdown')
      .on('hide.uni.dropdown', function (event) {
        event.preventDefault()
        done()
      })

    dropdown.hide()
    assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
  })

  test('should not open dropdown via show method if target is disabled via attribute', (assert) => {
    assert.expect(1)

    var dropdownHTML = '<div class="dropdown">' +
        '<button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown.show()
    assert.ok(!$dropdown.parent('.dropdown').hasClass('show'))
  })

  test('should not open dropdown via show method if target is disabled via class', (assert) => {
    assert.expect(1)

    var dropdownHTML = '<div class="dropdown">' +
        '<button href="#" class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown.show()
    assert.ok(!$dropdown.parent('.dropdown').hasClass('show'))
  })

  test('should not hide dropdown via hide method if target is disabled via attribute', (assert) => {
    assert.expect(1)

    var dropdownHTML = '<div class="dropdown show">' +
        '<button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown.hide()
    assert.ok($dropdown.parent('.dropdown').hasClass('show'))
  })

  test('should not hide dropdown via hide method if target is disabled via class', (assert) => {
    assert.expect(1)

    var dropdownHTML = '<div class="dropdown show">' +
        '<button href="#" class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown()

    $dropdown.hide()
    assert.ok($dropdown.parent('.dropdown').hasClass('show'))
  })

  test('should create offset modifier correctly when offset option is a function', (assert) => {
    assert.expect(2)

    var getOffset = function (offsets) {
      return offsets
    }

    var dropdownHTML =
      '<div class="dropdown">' +
      '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
      '<div class="dropdown-menu">' +
      '<a class="dropdown-item" href="#">Another link</a>' +
      '</div>' +
      '</div>'

    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown({
        offset: getOffset
      })

    var dropdown = $dropdown.data('uni.dropdown')
    var offset = dropdown._getOffset()

    assert.ok(typeof offset.offset === 'undefined')
    assert.ok(typeof offset.fn === 'function')
  })

  test('should create offset modifier correctly when offset option is not a function', (assert) => {
    assert.expect(2)

    var dropdownHTML =
      '<div class="dropdown">' +
      '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
      '<div class="dropdown-menu">' +
      '<a class="dropdown-item" href="#">Another link</a>' +
      '</div>' +
      '</div>'

    var myOffset = 42
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .unikornDropdown({
        offset: myOffset
      })

    var dropdown = $dropdown.data('uni.dropdown')
    var offset = dropdown._getOffset()

    assert.strictEqual(offset.offset, myOffset)
    assert.ok(typeof offset.fn === 'undefined')
  })
})
