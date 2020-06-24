/**
 * UniKorn (v1.1.0): tooltip.spec.js
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * -------------------------------------------------------------------------- */

$(() => {
  const { module, test } = QUnit

  window.Tooltip = typeof unikorn !== 'undefined' ? unikorn.Tooltip : Tooltip

  module('tooltip plugin', () => {
    test('should return `Tooltip` plugin version', (assert) => {
      assert.expect(1)
      assert.strictEqual(typeof Tooltip.VERSION, 'string')
    })

    test('should be defined on jquery object', (assert) => {
      assert.expect(1)
      assert.ok($(document.body).tooltip, 'tooltip method is defined')
    })
  })

  module('tooltip', {
    beforeEach: () => {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.unikornTooltip = $.fn.tooltip.noConflict()
    },
    afterEach: () => {
      $.fn.tooltip = $.fn.unikornTooltip
      delete $.fn.unikornTooltip
      $('.tooltip').remove()
      $('#qunit-fixture').html('')
    }
  })

  test('should provide no conflict', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.tooltip, 'undefined', 'tooltip was set back to undefined (org value)')
  })

  test('should throw explicit error on undefined method', (assert) => {
    assert.expect(1)

    var $el = $('<div/>')
    $el.unikornTooltip()

    try {
      $el.unikornTooltip('noMethod')
    } catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  test('should return jquery collection containing the element', (assert) => {
    assert.expect(2)

    var $el = $('<div/>')
    var $tooltip = $el.unikornTooltip()

    assert.ok($tooltip instanceof $, 'returns jquery collection')
    assert.strictEqual($tooltip[0], $el[0], 'collection contains element')
  })

  test('should expose default settings', (assert) => {
    assert.expect(1)

    assert.ok($.fn.unikornTooltip.Constructor.Default, 'defaults is defined')
  })

  test('should empty title attribute', (assert) => {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>').unikornTooltip()

    assert.strictEqual($trigger.attr('title'), '', 'title attribute was emptied')
  })

  test('should add data attribute for referencing original title', (assert) => {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>').unikornTooltip()

    assert.strictEqual($trigger.attr('data-original-title'), 'Another tooltip', 'original title preserved in data attribute')
  })

  test('should add aria-describedby to the trigger on show', (assert) => {
    assert.expect(3)

    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .unikornTooltip()
      .appendTo('#qunit-fixture')
      .unikornTooltip('show')

    var id = $('.tooltip').attr('id')

    assert.strictEqual($('#' + id).length, 1, 'has a unique id')
    assert.strictEqual($('.tooltip').attr('aria-describedby'), $trigger.attr('id'), 'tooltip id and aria-describedby on trigger match')
    assert.ok($trigger[0].hasAttribute('aria-describedby'), 'trigger has aria-describedby')
  })

  test('should remove aria-describedby from trigger on hide', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .unikornTooltip()
      .appendTo('#qunit-fixture')

    $trigger
      .one('shown.uni.tooltip', function () {
        assert.ok($trigger[0].hasAttribute('aria-describedby'), 'trigger has aria-describedby')
        $trigger.unikornTooltip('hide')
      })
      .one('hidden.uni.tooltip', function () {
        assert.ok(!$trigger[0].hasAttribute('aria-describedby'), 'trigger does not have aria-describedby')
        done()
      })
      .unikornTooltip('show')
  })

  test('should assign a unique id tooltip element', (assert) => {
    assert.expect(2)

    $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip('show')

    var id = $('.tooltip').attr('id')

    assert.strictEqual($('#' + id).length, 1, 'tooltip has unique id')
    assert.strictEqual(id.indexOf('tooltip'), 0, 'tooltip id has prefix')
  })

  test('should place tooltips relative to placement option', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        placement: 'bottom'
      })

    $tooltip
      .one('shown.uni.tooltip', function () {
        assert.ok($('.tooltip')
          .is('.fade.uni-tooltip-bottom.show'), 'has correct classes applied')

        $tooltip.unikornTooltip('hide')
      })
      .one('hidden.uni.tooltip', function () {
        assert.strictEqual($tooltip.data('uni.tooltip').tip.parentNode, null, 'tooltip removed')
        done()
      })
      .unikornTooltip('show')
  })

  test('should allow html entities', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="&lt;b&gt;@fat&lt;/b&gt;"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        html: true
      })

    $tooltip
      .one('shown.uni.tooltip', function () {
        assert.notStrictEqual($('.tooltip b').length, 0, 'b tag was inserted')
        $tooltip.unikornTooltip('hide')
      })
      .one('hidden.uni.tooltip', function () {
        assert.strictEqual($tooltip.data('uni.tooltip').tip.parentNode, null, 'tooltip removed')
        done()
      })
      .unikornTooltip('show')
  })

  test('should allow DOMElement title (html: false)', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var title = document.createTextNode('<3 writing tests')
    var $tooltip = $('<a href="#" rel="tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        title: title
      })

    $tooltip
      .one('shown.uni.tooltip', function () {
        assert.notStrictEqual($('.tooltip').length, 0, 'tooltip inserted')
        assert.strictEqual($('.tooltip').text(), '<3 writing tests', 'title inserted')
        assert.ok(!$.contains($('.tooltip').get(0), title), 'title node copied, not moved')
        done()
      })
      .unikornTooltip('show')
  })

  test('should allow DOMElement title (html: true)', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var title = document.createTextNode('<3 writing tests')
    var $tooltip = $('<a href="#" rel="tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        html: true,
        title: title
      })

    $tooltip
      .one('shown.uni.tooltip', function () {
        assert.notStrictEqual($('.tooltip').length, 0, 'tooltip inserted')
        assert.strictEqual($('.tooltip').text(), '<3 writing tests', 'title inserted')
        assert.ok($.contains($('.tooltip').get(0), title), 'title node moved, not copied')
        done()
      })
      .unikornTooltip('show')
  })

  test('should respect custom classes', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>'
      })

    $tooltip
      .one('shown.uni.tooltip', function () {
        assert.ok($('.tooltip').hasClass('some-class'), 'custom class is present')
        $tooltip.unikornTooltip('hide')
      })
      .one('hidden.uni.tooltip', function () {
        assert.strictEqual($tooltip.data('uni.tooltip').tip.parentNode, null, 'tooltip removed')
        done()
      })
      .unikornTooltip('show')
  })

  test('should fire show event', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .on('show.uni.tooltip', function () {
        assert.ok(true, 'show event fired')
        done()
      })
      .unikornTooltip('show')
  })

  test('should throw an error when show is called on hidden elements', (assert) => {
    assert.expect(1)
    var done = assert.async()

    try {
      $('<div title="tooltip title" style="display: none"/>').unikornTooltip('show')
    } catch (err) {
      assert.strictEqual(err.message, 'Please use show on visible elements')
      done()
    }
  })

  test('should fire inserted event', (assert) => {
    assert.expect(2)
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('inserted.uni.tooltip', function () {
        assert.notStrictEqual($('.tooltip').length, 0, 'tooltip was inserted')
        assert.ok(true, 'inserted event fired')
        done()
      })
      .unikornTooltip('show')
  })

  test('should fire shown event', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div title="tooltip title"></div>')
      .appendTo('#qunit-fixture')
      .on('shown.uni.tooltip', function () {
        assert.ok(true, 'shown was called')
        done()
      })
      .unikornTooltip('show')
  })

  test('should not fire shown event when show was prevented', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .on('show.uni.tooltip', function (e) {
        e.preventDefault()
        assert.ok(true, 'show event fired')
        done()
      })
      .on('shown.uni.tooltip', function () {
        assert.ok(false, 'shown event fired')
      })
      .unikornTooltip('show')
  })

  test('should fire hide event', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('shown.uni.tooltip', function () {
        $(this).unikornTooltip('hide')
      })
      .on('hide.uni.tooltip', function () {
        assert.ok(true, 'hide event fired')
        done()
      })
      .unikornTooltip('show')
  })

  test('should fire hidden event', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('shown.uni.tooltip', function () {
        $(this).unikornTooltip('hide')
      })
      .on('hidden.uni.tooltip', function () {
        assert.ok(true, 'hidden event fired')
        done()
      })
      .unikornTooltip('show')
  })

  test('should not fire hidden event when hide was prevented', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('shown.uni.tooltip', function () {
        $(this).unikornTooltip('hide')
      })
      .on('hide.uni.tooltip', function (e) {
        e.preventDefault()
        assert.ok(true, 'hide event fired')
        done()
      })
      .on('hidden.uni.tooltip', function () {
        assert.ok(false, 'hidden event fired')
      })
      .unikornTooltip('show')
  })

  test('should destroy tooltip', (assert) => {
    assert.expect(7)

    var $tooltip = $('<div/>')
      .unikornTooltip()
      .on('click.foo', function () {})  // eslint-disable-line no-empty-function

    assert.ok($tooltip.data('uni.tooltip'), 'tooltip has data')
    assert.ok($._data($tooltip[0], 'events').mouseover && $._data($tooltip[0], 'events').mouseout, 'tooltip has hover events')
    assert.strictEqual($._data($tooltip[0], 'events').click[0].namespace, 'foo', 'tooltip has extra click.foo event')

    $tooltip.unikornTooltip('show')
    $tooltip.unikornTooltip('dispose')

    assert.ok(!$tooltip.hasClass('show'), 'tooltip is hidden')
    assert.ok(!$._data($tooltip[0], 'uni.tooltip'), 'tooltip does not have data')
    assert.strictEqual($._data($tooltip[0], 'events').click[0].namespace, 'foo', 'tooltip still has click.foo')
    assert.ok(!$._data($tooltip[0], 'events').mouseover && !$._data($tooltip[0], 'events').mouseout, 'tooltip does not have hover events')
  })

  test('should show tooltip when toggle is called', (assert) => {
    assert.expect(1)

    $('<a href="#" rel="tooltip" title="tooltip on toggle"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({ trigger: 'manual' })
      .unikornTooltip('toggle')

    assert.ok($('.tooltip').is('.fade.show'), 'tooltip is faded active')
  })

  test('should hide previously shown tooltip when toggle is called on tooltip', (assert) => {
    assert.expect(1)

    $('<a href="#" rel="tooltip" title="tooltip on toggle">@ResentedHook</a>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({ trigger: 'manual' })
      .unikornTooltip('show')

    $('.tooltip').unikornTooltip('toggle')
    assert.ok($('.tooltip').not('.fade.show'), 'tooltip was faded out')
  })

  test('should place tooltips inside body when container is body', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        container: 'body'
      })

    $tooltip
      .one('shown.uni.tooltip', function () {
        assert.notStrictEqual($('body > .tooltip').length, 0, 'tooltip is direct descendant of body')
        assert.strictEqual($('#qunit-fixture > .tooltip').length, 0, 'tooltip is not in parent')
        $tooltip.unikornTooltip('hide')
      })
      .one('hidden.uni.tooltip', function () {
        assert.strictEqual($('body > .tooltip').length, 0, 'tooltip was removed from dom')
        done()
      })
      .unikornTooltip('show')
  })

  test('should place tooltips inside a specific container when container is an element', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var $container = $('<div></div>').appendTo('#qunit-fixture')
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        container: $container[0]
      })

    $tooltip
      .one('shown.uni.tooltip', function () {
        assert.strictEqual($container.find('.tooltip').length, 1)
        assert.strictEqual($('#qunit-fixture > .tooltip').length, 0, 'tooltip is not in parent')
        $tooltip.unikornTooltip('hide')
      })
      .one('hidden.uni.tooltip', function () {
        assert.strictEqual($container.find('.tooltip').length, 0, 'tooltip was removed from dom')
        done()
      })
      .unikornTooltip('show')
  })

  test('should place tooltips inside a specific container when container is a selector', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var $container = $('<div id="container"></div>').appendTo('#qunit-fixture')
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        container: '#container'
      })

    $tooltip
      .one('shown.uni.tooltip', function () {
        assert.strictEqual($container.find('.tooltip').length, 1)
        assert.strictEqual($('#qunit-fixture > .tooltip').length, 0, 'tooltip is not in parent')
        $tooltip.unikornTooltip('hide')
      })
      .one('hidden.uni.tooltip', function () {
        assert.strictEqual($container.find('.tooltip').length, 0, 'tooltip was removed from dom')
        done()
      })
      .unikornTooltip('show')
  })

  test('should add position class before positioning so that position-specific styles are taken into account', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var styles = '<style>' +
      '.uni-tooltip-right { white-space: nowrap; }' +
      '.uni-tooltip-right .tooltip-inner { max-width: none; }' +
      '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div/>').appendTo('#qunit-fixture')
    $('<a href="#" rel="tooltip" title="very very very very very very very very long tooltip in one line"/>')
      .appendTo($container)
      .unikornTooltip({
        placement: 'right',
        trigger: 'manual'
      })
      .on('inserted.uni.tooltip', function () {
        var $tooltip = $($(this).data('uni.tooltip').tip)
        assert.ok($tooltip.hasClass('uni-tooltip-right'))
        assert.ok(typeof $tooltip.attr('style') === 'undefined')
        $styles.remove()
        done()
      })
      .unikornTooltip('show')
  })

  test('should use title attribute for tooltip text', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip()

    $tooltip
      .one('shown.uni.tooltip', function () {
        assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title from title attribute is set')
        $tooltip.unikornTooltip('hide')
      })
      .one('hidden.uni.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .unikornTooltip('show')
  })

  test('should prefer title attribute over title option', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        title: 'This is a tooltip with some content'
      })

    $tooltip
      .one('shown.uni.tooltip', function () {
        assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title is set from title attribute while preferred over title option')
        $tooltip.unikornTooltip('hide')
      })
      .one('hidden.uni.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .unikornTooltip('show')
  })

  test('should use title option', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        title: 'This is a tooltip with some content'
      })

    $tooltip
      .one('shown.uni.tooltip', function () {
        assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'This is a tooltip with some content', 'title from title option is set')
        $tooltip.unikornTooltip('hide')
      })
      .one('hidden.uni.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .unikornTooltip('show')
  })

  test('should not error when trying to show an top-placed tooltip that has been removed from the dom', (assert) => {
    assert.expect(1)

    var passed = true
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .one('show.uni.tooltip', function () {
        $(this).remove()
      })
      .unikornTooltip({ placement: 'top' })

    try {
      $tooltip.unikornTooltip('show')
    } catch (err) {
      passed = false
      console.log(err)
    }

    assert.ok(passed, '.tooltip(\'show\') should not throw an error if element no longer is in dom')
  })

  test('should show tooltip if leave event hasn\'t occurred before delay expires', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({ delay: 150 })

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '100ms: tooltip is not faded active')
    }, 100)

    setTimeout(function () {
      assert.ok($('.tooltip').is('.fade.show'), '200ms: tooltip is faded active')
      done()
    }, 200)

    $tooltip.trigger('mouseenter')
  })

  test('should not show tooltip if leave event occurs before delay expires', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({ delay: 150 })

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '100ms: tooltip not faded active')
      $tooltip.trigger('mouseout')
    }, 100)

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '200ms: tooltip not faded active')
      done()
    }, 200)

    $tooltip.trigger('mouseenter')
  })

  test('should not hide tooltip if leave event occurs and enter event occurs within the hide delay', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        delay: {
          show: 0,
          hide: 150
        }
      })

    setTimeout(function () {
      assert.ok($('.tooltip').is('.fade.show'), '1ms: tooltip faded active')
      $tooltip.trigger('mouseout')

      setTimeout(function () {
        assert.ok($('.tooltip').is('.fade.show'), '100ms: tooltip still faded active')
        $tooltip.trigger('mouseenter')
      }, 100)

      setTimeout(function () {
        assert.ok($('.tooltip').is('.fade.show'), '200ms: tooltip still faded active')
        done()
      }, 200)
    }, 0)

    $tooltip.trigger('mouseenter')
  })

  test('should not show tooltip if leave event occurs before delay expires', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        delay: 150
      })

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '100ms: tooltip not faded active')
      $tooltip.trigger('mouseout')
    }, 100)

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '200ms: tooltip not faded active')
      done()
    }, 200)

    $tooltip.trigger('mouseenter')
  })

  test('should not show tooltip if leave event occurs before delay expires, even if hide delay is 0', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        delay: {
          show: 150,
          hide: 0
        }
      })

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '100ms: tooltip not faded active')
      $tooltip.trigger('mouseout')
    }, 100)

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '250ms: tooltip not faded active')
      done()
    }, 250)

    $tooltip.trigger('mouseenter')
  })

  test('should wait 200ms before hiding the tooltip', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        delay: {
          show: 0,
          hide: 150
        }
      })

    setTimeout(function () {
      assert.ok($($tooltip.data('uni.tooltip').tip).is('.fade.show'), '1ms: tooltip faded active')

      $tooltip.trigger('mouseout')

      setTimeout(function () {
        assert.ok($($tooltip.data('uni.tooltip').tip).is('.fade.show'), '100ms: tooltip still faded active')
      }, 100)

      setTimeout(function () {
        assert.ok(!$($tooltip.data('uni.tooltip').tip).is('.show'), '200ms: tooltip removed')
        done()
      }, 200)
    }, 0)

    $tooltip.trigger('mouseenter')
  })

  test('should not reload the tooltip on subsequent mouseenter events', (assert) => {
    assert.expect(1)

    var titleHtml = function () {
      var uid = Util.getUID('tooltip')
      return '<p id="tt-content">' + uid + '</p><p>' + uid + '</p><p>' + uid + '</p>'
    }

    var $tooltip = $('<span id="tt-outer" rel="tooltip" data-trigger="hover" data-placement="top">some text</span>')
      .appendTo('#qunit-fixture')

    $tooltip.unikornTooltip({
      html: true,
      animation: false,
      trigger: 'hover',
      delay: {
        show: 0,
        hide: 500
      },
      container: $tooltip,
      title: titleHtml
    })

    $('#tt-outer').trigger('mouseenter')

    var currentUid = $('#tt-content').text()

    $('#tt-content').trigger('mouseenter')
    assert.strictEqual(currentUid, $('#tt-content').text())
  })

  test('should not reload the tooltip if the mouse leaves and re-enters before hiding', (assert) => {
    assert.expect(4)

    var titleHtml = function () {
      var uid = Util.getUID('tooltip')
      return '<p id="tt-content">' + uid + '</p><p>' + uid + '</p><p>' + uid + '</p>'
    }

    var $tooltip = $('<span id="tt-outer" rel="tooltip" data-trigger="hover" data-placement="top">some text</span>')
      .appendTo('#qunit-fixture')

    $tooltip.unikornTooltip({
      html: true,
      animation: false,
      trigger: 'hover',
      delay: {
        show: 0,
        hide: 500
      },
      title: titleHtml
    })

    var obj = $tooltip.data('uni.tooltip')

    $('#tt-outer').trigger('mouseenter')

    var currentUid = $('#tt-content').text()

    $('#tt-outer').trigger('mouseleave')
    assert.strictEqual(currentUid, $('#tt-content').text())

    assert.ok(obj._hoverState === 'out', 'the tooltip hoverState should be set to "out"')

    $('#tt-outer').trigger('mouseenter')
    assert.ok(obj._hoverState === 'show', 'the tooltip hoverState should be set to "show"')

    assert.strictEqual(currentUid, $('#tt-content').text())
  })

  test('should do nothing when an attempt is made to hide an uninitialized tooltip', (assert) => {
    assert.expect(1)

    var $tooltip = $('<span data-toggle="tooltip" title="some tip">some text</span>')
      .appendTo('#qunit-fixture')
      .on('hidden.uni.tooltip shown.uni.tooltip', function () {
        assert.ok(false, 'should not fire any tooltip events')
      })
      .unikornTooltip('hide')
    assert.strictEqual(typeof $tooltip.data('uni.tooltip'), 'undefined', 'should not initialize the tooltip')
  })

  test('should not remove tooltip if multiple triggers are set and one is still active', (assert) => {
    assert.expect(41)

    var $el = $('<button>Trigger</button>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        trigger: 'click hover focus',
        animation: false
      })
    var tooltip = $el.data('uni.tooltip')
    var $tooltip = $(tooltip.getTipElement())

    function showingTooltip() {
      return $tooltip.hasClass('show') || tooltip._hoverState === 'show'
    }

    var tests = [
      ['mouseenter', 'mouseleave'],

      ['focusin', 'focusout'],

      ['click', 'click'],

      ['mouseenter', 'focusin', 'focusout', 'mouseleave'],
      ['mouseenter', 'focusin', 'mouseleave', 'focusout'],

      ['focusin', 'mouseenter', 'mouseleave', 'focusout'],
      ['focusin', 'mouseenter', 'focusout', 'mouseleave'],

      ['click', 'focusin', 'mouseenter', 'focusout', 'mouseleave', 'click'],
      ['mouseenter', 'click', 'focusin', 'focusout', 'mouseleave', 'click'],
      ['mouseenter', 'focusin', 'click', 'click', 'mouseleave', 'focusout']
    ]

    assert.ok(!showingTooltip())

    $.each(tests, function (idx, triggers) {
      for (var i = 0, len = triggers.length; i < len; i++) {
        $el.trigger(triggers[i])
        assert.equal(i < len - 1, showingTooltip())
      }
    })
  })

  test('should show on first trigger after hide', (assert) => {
    assert.expect(3)

    var $el = $('<a href="#" rel="tooltip" title="Test tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        trigger: 'click hover focus',
        animation: false
      })

    var tooltip = $el.data('uni.tooltip')
    var $tooltip = $(tooltip.getTipElement())

    function showingTooltip() {
      return $tooltip.hasClass('show') || tooltip._hoverState === 'show'
    }

    $el.trigger('click')
    assert.ok(showingTooltip(), 'tooltip is faded in')

    $el.unikornTooltip('hide')
    assert.ok(!showingTooltip(), 'tooltip was faded out')

    $el.trigger('click')
    assert.ok(showingTooltip(), 'tooltip is faded in again')
  })

  test('should hide tooltip when their containing modal is closed', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var templateHTML = '<div id="modal-test" class="modal">' +
        '<div class="modal-dialog" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-body">' +
        '<a id="tooltipTest" href="#" data-toggle="tooltip" title="Some tooltip text!">Tooltip</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    $(templateHTML).appendTo('#qunit-fixture')

    $('#tooltipTest')
      .unikornTooltip({
        trigger: 'manuel'
      })
      .on('shown.uni.tooltip', function () {
        $('#modal-test').modal('hide')
      })
      .on('hide.uni.tooltip', function () {
        assert.ok(true, 'tooltip hide')
        done()
      })

    $('#modal-test')
      .on('shown.uni.modal', function () {
        $('#tooltipTest').unikornTooltip('show')
      })
      .modal('show')
  })

  test('should allow to close modal if the tooltip element is detached', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var templateHTML = [
      '<div id="modal-test" class="modal">',
      '  <div class="modal-dialog" role="document">',
      '    <div class="modal-content">',
      '      <div class="modal-body">',
      '        <a id="tooltipTest" href="#" data-toggle="tooltip" title="Some tooltip text!">Tooltip</a>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')
    $(templateHTML).appendTo('#qunit-fixture')

    var $tooltip = $('#tooltipTest')
    var $modal = $('#modal-test')

    $tooltip.on('shown.uni.tooltip', function () {
      $tooltip.detach()
      $tooltip.unikornTooltip('dispose')
      $modal.modal('hide')
    })

    $modal.on('shown.uni.modal', function () {
      $tooltip.unikornTooltip({
        trigger: 'manuel'
      })
        .unikornTooltip('show')
    })
      .on('hidden.uni.modal', function () {
        assert.ok(true, 'modal hidden')
        done()
      })
      .modal('show')
  })

  test('should reset tip classes when hidden event triggered', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $el = $('<a href="#" rel="tooltip" title="Test tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip('show')
      .on('hidden.uni.tooltip', function () {
        var tooltip = $el.data('uni.tooltip')
        var $tooltip = $(tooltip.getTipElement())
        assert.ok($tooltip.hasClass('tooltip'))
        assert.ok($tooltip.hasClass('fade'))
        done()
      })

    $el.unikornTooltip('hide')
  })

  test('should convert number in title to string', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $el = $('<a href="#" rel="tooltip" title="7"/>')
      .appendTo('#qunit-fixture')
      .on('shown.uni.tooltip', function () {
        var tooltip = $el.data('uni.tooltip')
        var $tooltip = $(tooltip.getTipElement())
        assert.strictEqual($tooltip.children().text(), '7')
        done()
      })

    $el.unikornTooltip('show')
  })

  test('tooltip should be shown right away after the call of disable/enable', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip()
      .on('shown.uni.tooltip', function () {
        assert.strictEqual($('.tooltip').hasClass('show'), true)
        done()
      })

    $trigger.unikornTooltip('disable')
    $trigger.trigger($.Event('click'))
    setTimeout(function () {
      assert.strictEqual($('.tooltip').length === 0, true)
      $trigger.unikornTooltip('enable')
      $trigger.trigger($.Event('click'))
    }, 200)
  })

  test('should call Popper.js to update', (assert) => {
    assert.expect(2)

    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip()

    var tooltip = $tooltip.data('uni.tooltip')
    tooltip.show()
    assert.ok(tooltip._popper)

    var spyPopper = sinon.spy(tooltip._popper, 'scheduleUpdate')
    tooltip.update()
    assert.ok(spyPopper.called)
  })

  test('should not call Popper.js to update', (assert) => {
    assert.expect(1)

    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip()

    var tooltip = $tooltip.data('uni.tooltip')
    tooltip.update()

    assert.ok(tooltip._popper === null)
  })

  test('should use Popper.js to get the tip on placement change', (assert) => {
    assert.expect(1)

    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip()

    var $tipTest = $('<div class="uni-tooltip" />')
      .appendTo('#qunit-fixture')

    var tooltip = $tooltip.data('uni.tooltip')
    tooltip.tip = null

    tooltip._handlePopperPlacementChange({
      instance: {
        popper: $tipTest[0]
      },
      placement: 'auto'
    })

    assert.ok(tooltip.tip === $tipTest[0])
  })

  test('should toggle enabled', (assert) => {
    assert.expect(3)

    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip()

    var tooltip = $tooltip.data('uni.tooltip')

    assert.strictEqual(tooltip._isEnabled, true)

    tooltip.toggleEnabled()

    assert.strictEqual(tooltip._isEnabled, false)

    tooltip.toggleEnabled()

    assert.strictEqual(tooltip._isEnabled, true)
  })

  test('should create offset modifier correctly when offset option is a function', (assert) => {
    assert.expect(2)

    var getOffset = function (offsets) {
      return offsets
    }

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        offset: getOffset
      })

    var tooltip = $trigger.data('uni.tooltip')
    var offset = tooltip._getOffset()

    assert.ok(typeof offset.offset === 'undefined')
    assert.ok(typeof offset.fn === 'function')
  })

  test('should create offset modifier correctly when offset option is not a function', (assert) => {
    assert.expect(2)

    var myOffset = 42
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        offset: myOffset
      })

    var tooltip = $trigger.data('uni.tooltip')
    var offset = tooltip._getOffset()

    assert.strictEqual(offset.offset, myOffset)
    assert.ok(typeof offset.fn === 'undefined')
  })

  test('should disable sanitizer', (assert) => {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        sanitize: false
      })

    var tooltip = $trigger.data('uni.tooltip')
    assert.strictEqual(tooltip.config.sanitize, false)
  })

  test('should sanitize template by removing disallowed tags', (assert) => {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        template: [
          '<div>',
          '  <script>console.log("oups script inserted")</script>',
          '  <span>Some content</span>',
          '</div>'
        ].join('')
      })

    var tooltip = $trigger.data('uni.tooltip')
    assert.strictEqual(tooltip.config.template.indexOf('script'), -1)
  })

  test('should sanitize template by removing disallowed attributes', (assert) => {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        template: [
          '<div>',
          '  <img src="x" onError="alert(\'test\')">Some content</img>',
          '</div>'
        ].join('')
      })

    var tooltip = $trigger.data('uni.tooltip')
    assert.strictEqual(tooltip.config.template.indexOf('onError'), -1)
  })

  test('should sanitize template by removing tags with XSS', (assert) => {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        template: [
          '<div>',
          '  <a href="javascript:alert(7)">Click me</a>',
          '  <span>Some content</span>',
          '</div>'
        ].join('')
      })

    var tooltip = $trigger.data('uni.tooltip')
    assert.strictEqual(tooltip.config.template.indexOf('script'), -1)
  })

  test('should allow custom sanitization rules', (assert) => {
    assert.expect(2)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        template: [
          '<a href="javascript:alert(7)">Click me</a>',
          '<span>Some content</span>'
        ].join(''),
        whiteList: {
          span: null
        }
      })

    var tooltip = $trigger.data('uni.tooltip')

    assert.strictEqual(tooltip.config.template.indexOf('<a'), -1)
    assert.ok(tooltip.config.template.indexOf('span') !== -1)
  })

  test('should allow passing a custom function for sanitization', (assert) => {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        template: [
          '<span>Some content</span>'
        ].join(''),
        sanitizeFn: function (input) {
          return input
        }
      })

    var tooltip = $trigger.data('uni.tooltip')

    assert.ok(tooltip.config.template.indexOf('span') !== -1)
  })

  test('should allow passing aria attributes', (assert) => {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        template: [
          '<span aria-pressed="true">Some content</span>'
        ].join('')
      })

    var tooltip = $trigger.data('uni.tooltip')

    assert.ok(tooltip.config.template.indexOf('aria-pressed') !== -1)
  })

  test('should not sanitize element content', (assert) => {
    assert.expect(1)

    var $element = $('<div />').appendTo('#qunit-fixture')
    var content = '<script>var test = 1;</script>'

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        template: [
          '<span aria-pressed="true">Some content</span>'
        ].join(''),
        html: true,
        sanitize: false
      })

    var tooltip = $trigger.data('uni.tooltip')
    tooltip.setElementContent($element, content)

    assert.strictEqual($element[0].innerHTML, content)
  })

  test('should not take into account sanitize in data attributes', (assert) => {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-sanitize="false" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        template: [
          '<span aria-pressed="true">Some content</span>'
        ].join('')
      })

    var tooltip = $trigger.data('uni.tooltip')

    assert.strictEqual(tooltip.config.sanitize, true)
  })

  test('should allow to pass config to popper.js with `popperConfig`', (assert) => {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornTooltip({
        popperConfig: {
          placement: 'left'
        }
      })

    var tooltip = $trigger.data('uni.tooltip')
    var popperConfig = tooltip._getPopperConfig('top')

    assert.strictEqual(popperConfig.placement, 'left')
  })
})
