$(function () {
  'use strict'

  const { module, test } = QUnit
  const $drawerScrollbarMeasure = $('<style> .drawer-scrollbar-measure { position: absolute; top: -9999px; width: 50px; height: 50px; overflow: scroll; } </style>')

  window.Drawer = typeof unikorn !== 'undefined' ? unikorn.Drawer : Drawer

  module('drawer plugin', () => {
    test('should be defined on jquery object', (assert) => {
      assert.expect(1)
      assert.ok($(document.body).drawer, 'drawer method is defined')
    })
  })

  module('drawer', {
    before: () => {
      // Enable the scrollbar measurer
      $drawerScrollbarMeasure.appendTo('head')
      // Function to calculate the scrollbar width which is then compared to the padding or margin changes
      $.fn.getScrollbarWidth = $.fn.drawer.Constructor.prototype._getScrollbarWidth

      // Simulate scrollbars
      $('html').css('padding-right', '16px')
    },
    beforeEach: () => {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.unikornDrawer = $.fn.drawer.noConflict()
    },
    afterEach: () => {
      $('.drawer-backdrop, #drawer-test').remove()
      $(document.body).removeClass('drawer-open')
      $.fn.drawer = $.fn.unikornDrawer
      delete $.fn.unikornDrawer
      $('#qunit-fixture').html('')
    },
    after: () => {
      // Disable the scrollbar measurer
      $drawerScrollbarMeasure.remove()
      // Restore scrollbars
      $('html').removeAttr('style')
      // $('body').removeAttr('class style')
    }
  })

  test('should provide no conflict', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.drawer, 'undefined', 'drawer was set back to undefined (org value)')
  })

  test('should return drawer version', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof Drawer.VERSION, 'string')
  })

  test('should throw explicit error on undefined method', (assert) => {
    assert.expect(1)

    var $el = $('<div id="drawer-test"/>')

    $el.unikornDrawer()
    try {
      $el.unikornDrawer('noMethod')
    } catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  test('should return jquery collection containing the element', (assert) => {
    assert.expect(2)

    var $el = $('<div id="drawer-test"/>')
    var $drawer = $el.unikornDrawer()

    assert.ok($drawer instanceof $, 'returns jquery collection')
    assert.strictEqual($drawer[0], $el[0], 'collection contains element')
  })

  test('should expose defaults var for settings', (assert) => {
    assert.expect(1)
    assert.ok($.fn.unikornDrawer.Constructor.Default, 'default object exposed')
  })

  test('should insert into dom when show method is called', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div id="drawer-test"/>')
      .on('shown.uni.drawer', function () {
        assert.notEqual($('#drawer-test').length, 0, 'drawer inserted into dom')
        done()
      })
      .unikornDrawer('show')
  })

  test('should fire show event', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div id="drawer-test"/>')
      .on('show.uni.drawer', function () {
        assert.ok(true, 'show event fired')
        done()
      })
      .unikornDrawer('show')
  })

  test('should not fire shown when show was prevented', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div id="drawer-test"/>')
      .on('show.uni.drawer', function (e) {
        e.preventDefault()
        assert.ok(true, 'show event fired')
        done()
      })
      .on('shown.uni.drawer', function () {
        assert.ok(false, 'shown event fired')
      })
      .unikornDrawer('show')
  })

  test('should hide drawer when hide is called', (assert) => {
    assert.expect(3)
    var done = assert.async()

    $('<div id="drawer-test"/>')
      .on('shown.uni.drawer', function () {
        assert.ok($('#drawer-test').is(':visible'), 'drawer visible')
        assert.notEqual($('#drawer-test').length, 0, 'drawer inserted into dom')
        $(this).unikornDrawer('hide')
      })
      .on('hidden.uni.drawer', function () {
        assert.ok(!$('#drawer-test').is(':visible'), 'drawer hidden')
        done()
      })
      .unikornDrawer('show')
  })

  test('should toggle when toggle is called', (assert) => {
    assert.expect(3)
    var done = assert.async()

    $('<div id="drawer-test"/>')
      .on('shown.uni.drawer', function () {
        assert.ok($('#drawer-test').is(':visible'), 'drawer visible')
        assert.notEqual($('#drawer-test').length, 0, 'drawer inserted into dom')
        $(this).unikornDrawer('toggle')
      })
      .on('hidden.uni.drawer', function () {
        assert.ok(!$('#drawer-test').is(':visible'), 'drawer hidden')
        done()
      })
      .unikornDrawer('toggle')
  })

  test('should remove from dom when click [data-dismiss="drawer"]', (assert) => {
    assert.expect(3)
    var done = assert.async()

    $('<div id="drawer-test"><span class="close" data-dismiss="drawer"/></div>')
      .on('shown.uni.drawer', function () {
        assert.ok($('#drawer-test').is(':visible'), 'drawer visible')
        assert.notEqual($('#drawer-test').length, 0, 'drawer inserted into dom')
        $(this).find('.close').trigger('click')
      })
      .on('hidden.uni.drawer', function () {
        assert.ok(!$('#drawer-test').is(':visible'), 'drawer hidden')
        done()
      })
      .unikornDrawer('toggle')
  })

  test('should allow drawer close with [data-backdrop="false"]', (assert) => {
    assert.expect(2)
    var done = assert.async()

    $('<div id="drawer-test" data-backdrop="false"/>')
      .on('shown.uni.drawer', function () {
        assert.ok($('#drawer-test').is(':visible'), 'drawer visible')
        $(this).unikornDrawer('hide')
      })
      .on('hidden.uni.drawer', function () {
        assert.ok(!$('#drawer-test').is(':visible'), 'drawer hidden')
        done()
      })
      .unikornDrawer('show')
  })

  test('should close drawer when clicking outside of drawer-content', (assert) => {
    assert.expect(3)
    var done = assert.async()

    $('<div id="drawer-test"><div class="contents"/></div>')
      .on('shown.uni.drawer', function () {
        assert.notEqual($('#drawer-test').length, 0, 'drawer inserted into dom')
        $('.contents').trigger('click')
        assert.ok($('#drawer-test').is(':visible'), 'drawer visible')
        $('#drawer-test').trigger('click')
      })
      .on('hidden.uni.drawer', function () {
        assert.ok(!$('#drawer-test').is(':visible'), 'drawer hidden')
        done()
      })
      .unikornDrawer('show')
  })

  test('should not close drawer when clicking outside of drawer-content if [data-backdrop="true"]', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div id="drawer-test" data-backdrop="false"><div class="contents"/></div>')
      .on('shown.uni.drawer', function () {
        $('#drawer-test').trigger('click')
        assert.ok($('#drawer-test').is(':visible'), 'drawer not hidden')
        done()
      })
      .unikornDrawer('show')
  })

  test('should close drawer when escape key is pressed via keydown', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var $div = $('<div id="drawer-test"/>')
    $div
      .on('shown.uni.drawer', function () {
        assert.ok($('#drawer-test').length, 'drawer inserted into dom')
        assert.ok($('#drawer-test').is(':visible'), 'drawer visible')
        $div.trigger($.Event('keydown', { which: 27 }))

        setTimeout(function () {
          assert.ok(!$('#drawer-test').is(':visible'), 'drawer hidden')
          $div.remove()
          done()
        }, 0)
      })
      .unikornDrawer('show')
  })

  test('should not close drawer when escape key is pressed via keyup', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var $div = $('<div id="drawer-test"/>')
    $div
      .on('shown.uni.drawer', function () {
        assert.ok($('#drawer-test').length, 'drawer inserted into dom')
        assert.ok($('#drawer-test').is(':visible'), 'drawer visible')
        $div.trigger($.Event('keyup', { which: 27 }))

        setTimeout(function () {
          assert.ok($div.is(':visible'), 'drawer still visible')
          $div.remove()
          done()
        }, 0)
      })
      .unikornDrawer('show')
  })

  test('should trigger hide event once when clicking outside of drawer-content', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var triggered

    $('<div id="drawer-test"><div class="contents"/></div>')
      .on('shown.uni.drawer', function () {
        triggered = 0
        $('#drawer-test').trigger('click')
      })
      .on('hide.uni.drawer', function () {
        triggered += 1
        assert.strictEqual(triggered, 1, 'drawer hide triggered once')
        done()
      })
      .unikornDrawer('show')
  })

  test('should remove aria-hidden attribute when shown, add it back when hidden', (assert) => {
    assert.expect(3)
    var done = assert.async()

    $('<div id="drawer-test" aria-hidden="true"/>')
      .on('shown.uni.drawer', function () {
        assert.notOk($('#drawer-test').is('[aria-hidden]'), 'aria-hidden attribute removed')
        $(this).unikornDrawer('hide')
      })
      .on('hidden.uni.drawer', function () {
        assert.ok($('#drawer-test').is('[aria-hidden]'), 'aria-hidden attribute added')
        assert.strictEqual($('#drawer-test').attr('aria-hidden'), 'true', 'correct aria-hidden="true" added')
        done()
      })
      .unikornDrawer('show')
  })

  test('should add aria-drawer attribute when shown, remove it again when hidden', (assert) => {
    assert.expect(3)
    var done = assert.async()

    $('<div id="drawer-test"/>')
      .on('shown.uni.drawer', function () {
        assert.ok($('#drawer-test').is('[aria-drawer]'), 'aria-drawer attribute added')
        assert.strictEqual($('#drawer-test').attr('aria-drawer'), 'true', 'correct aria-drawer="true" added')
        $(this).unikornDrawer('hide')
      })
      .on('hidden.uni.drawer', function () {
        assert.notOk($('#drawer-test').is('[aria-drawer]'), 'aria-drawer attribute removed')
        done()
      })
      .unikornDrawer('show')
  })

  test('should close reopened drawer with [data-dismiss="drawer"] click', (assert) => {
    assert.expect(2)
    var done = assert.async()

    $('<div id="drawer-test"><div class="contents"><div id="close" data-dismiss="drawer"/></div></div>')
      .one('shown.uni.drawer', function () {
        $('#close').trigger('click')
      })
      .one('hidden.uni.drawer', function () {
        // after one open-close cycle
        assert.ok(!$('#drawer-test').is(':visible'), 'drawer hidden')
        $(this)
          .one('shown.uni.drawer', function () {
            $('#close').trigger('click')
          })
          .one('hidden.uni.drawer', function () {
            assert.ok(!$('#drawer-test').is(':visible'), 'drawer hidden')
            done()
          })
          .unikornDrawer('show')
      })
      .unikornDrawer('show')
  })

  test('should restore focus to toggling element when drawer is hidden after having been opened via data-api', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $toggleBtn = $('<button data-toggle="drawer" data-target="#drawer-test"/>').appendTo('#qunit-fixture')

    $('<div id="drawer-test"><div class="contents"><div id="close" data-dismiss="drawer"/></div></div>')
      .on('hidden.uni.drawer', function () {
        setTimeout(function () {
          assert.ok($(document.activeElement).is($toggleBtn), 'toggling element is once again focused')
          done()
        }, 0)
      })
      .on('shown.uni.drawer', function () {
        $('#close').trigger('click')
      })
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')
  })

  test('should not restore focus to toggling element if the associated show event gets prevented', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $toggleBtn = $('<button data-toggle="drawer" data-target="#drawer-test"/>').appendTo('#qunit-fixture')
    var $otherBtn = $('<button id="other-btn"/>').appendTo('#qunit-fixture')

    $('<div id="drawer-test"><div class="contents"><div id="close" data-dismiss="drawer"/></div>')
      .one('show.uni.drawer', function (e) {
        e.preventDefault()
        $otherBtn.trigger('focus')
        setTimeout($.proxy(function () {
          $(this).unikornDrawer('show')
        }, this), 0)
      })
      .on('hidden.uni.drawer', function () {
        setTimeout(function () {
          assert.ok($(document.activeElement).is($otherBtn), 'focus returned to toggling element')
          done()
        }, 0)
      })
      .on('shown.uni.drawer', function () {
        $('#close').trigger('click')
      })
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')
  })

  test('should adjust the inline padding of the drawer when opening', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div id="drawer-test"/>')
      .on('shown.uni.drawer', function () {
        var expectedPadding = $(this).getScrollbarWidth() + 'px'
        var currentPadding = $(this).css('padding-right')
        assert.strictEqual(currentPadding, expectedPadding, 'drawer padding should be adjusted while opening')
        done()
      })
      .unikornDrawer('show')
  })

  test('should adjust the inline body padding when opening and restore when closing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $body = $(document.body)
    var originalPadding = $body.css('padding-right')

    $('<div id="drawer-test"/>')
      .on('hidden.uni.drawer', function () {
        var currentPadding = $body.css('padding-right')
        assert.strictEqual(currentPadding, originalPadding, 'body padding should be reset after closing')
        $body.removeAttr('style')
        done()
      })
      .on('shown.uni.drawer', function () {
        var expectedPadding = parseFloat(originalPadding) + $(this).getScrollbarWidth() + 'px'
        var currentPadding = $body.css('padding-right')
        assert.strictEqual(currentPadding, expectedPadding, 'body padding should be adjusted while opening')
        $(this).unikornDrawer('hide')
      })
      .unikornDrawer('show')
  })

  test('should store the original body padding in data-padding-right before showing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $body = $(document.body)
    var originalPadding = '0px'
    $body.css('padding-right', originalPadding)

    $('<div id="drawer-test"/>')
      .on('hidden.uni.drawer', function () {
        assert.strictEqual(typeof $body.data('padding-right'), 'undefined', 'data-padding-right should be cleared after closing')
        $body.removeAttr('style')
        done()
      })
      .on('shown.uni.drawer', function () {
        assert.strictEqual($body.data('padding-right'), originalPadding, 'original body padding should be stored in data-padding-right')
        $(this).unikornDrawer('hide')
      })
      .unikornDrawer('show')
  })

  test('should not adjust the inline body padding when it does not overflow', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $body = $(document.body)
    var originalPadding = $body.css('padding-right')

    // Hide scrollbars to prevent the body overflowing
    $body.css('overflow', 'hidden')        // real scrollbar (for in-browser testing)
    $('html').css('padding-right', '0px')  // simulated scrollbar (for PhantomJS)

    $('<div id="drawer-test"/>')
      .on('shown.uni.drawer', function () {
        var currentPadding = $body.css('padding-right')
        assert.strictEqual(currentPadding, originalPadding, 'body padding should not be adjusted')
        $(this).unikornDrawer('hide')

        // restore scrollbars
        $body.css('overflow', 'auto')
        $('html').css('padding-right', '16px')
        done()
      })
      .unikornDrawer('show')
  })

  test('should adjust the inline padding of fixed elements when opening and restore when closing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $element = $('<div class="fixed-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = $element.css('padding-right')

    $('<div id="drawer-test"/>')
      .on('hidden.uni.drawer', function () {
        var currentPadding = $element.css('padding-right')
        assert.strictEqual(currentPadding, originalPadding, 'fixed element padding should be reset after closing')
        $element.remove()
        done()
      })
      .on('shown.uni.drawer', function () {
        var expectedPadding = parseFloat(originalPadding) + $(this).getScrollbarWidth() + 'px'
        var currentPadding = $element.css('padding-right')
        assert.strictEqual(currentPadding, expectedPadding, 'fixed element padding should be adjusted while opening')
        $(this).unikornDrawer('hide')
      })
      .unikornDrawer('show')
  })

  test('should store the original padding of fixed elements in data-padding-right before showing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $element = $('<div class="fixed-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = '0px'
    $element.css('padding-right', originalPadding)

    $('<div id="drawer-test"/>')
      .on('hidden.uni.drawer', function () {
        assert.strictEqual(typeof $element.data('padding-right'), 'undefined', 'data-padding-right should be cleared after closing')
        $element.remove()
        done()
      })
      .on('shown.uni.drawer', function () {
        assert.strictEqual($element.data('padding-right'), originalPadding, 'original fixed element padding should be stored in data-padding-right')
        $(this).unikornDrawer('hide')
      })
      .unikornDrawer('show')
  })

  test('should adjust the inline margin of sticky elements when opening and restore when closing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $element = $('<div class="sticky-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = $element.css('margin-right')

    $('<div id="drawer-test"/>')
      .on('hidden.uni.drawer', function () {
        var currentPadding = $element.css('margin-right')
        assert.strictEqual(currentPadding, originalPadding, 'sticky element margin should be reset after closing')
        $element.remove()
        done()
      })
      .on('shown.uni.drawer', function () {
        var expectedPadding = parseFloat(originalPadding) - $(this).getScrollbarWidth() + 'px'
        var currentPadding = $element.css('margin-right')
        assert.strictEqual(currentPadding, expectedPadding, 'sticky element margin should be adjusted while opening')
        $(this).unikornDrawer('hide')
      })
      .unikornDrawer('show')
  })

  test('should store the original margin of sticky elements in data-margin-right before showing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $element = $('<div class="sticky-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = '0px'
    $element.css('margin-right', originalPadding)

    $('<div id="drawer-test"/>')
      .on('hidden.uni.drawer', function () {
        assert.strictEqual(typeof $element.data('margin-right'), 'undefined', 'data-margin-right should be cleared after closing')
        $element.remove()
        done()
      })
      .on('shown.uni.drawer', function () {
        assert.strictEqual($element.data('margin-right'), originalPadding, 'original sticky element margin should be stored in data-margin-right')
        $(this).unikornDrawer('hide')
      })
      .unikornDrawer('show')
  })

  test('should ignore values set via CSS when trying to restore body padding after closing', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $body = $(document.body)
    var $style = $('<style>body { padding-right: 42px; }</style>').appendTo('head')

    $('<div id="drawer-test"/>')
      .on('hidden.uni.drawer', function () {
        assert.strictEqual($body.attr('style').indexOf('padding-right'), -1, 'body does not have inline padding set')
        $style.remove()
        done()
      })
      .on('shown.uni.drawer', function () {
        $(this).unikornDrawer('hide')
      })
      .unikornDrawer('show')
  })

  test('should ignore other inline styles when trying to restore body padding after closing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $body = $(document.body)
    var $style = $('<style>body { padding-right: 42px; }</style>').appendTo('head')

    $body.css('color', 'red')

    $('<div id="drawer-test"/>')
      .on('hidden.uni.drawer', function () {
        assert.strictEqual($body[0].style.paddingRight, '', 'body does not have inline padding set')
        assert.strictEqual($body[0].style.color, 'red', 'body still has other inline styles set')
        $body.removeAttr('style')
        $style.remove()
        done()
      })
      .on('shown.uni.drawer', function () {
        $(this).unikornDrawer('hide')
      })
      .unikornDrawer('show')
  })

  test('should properly restore non-pixel inline body padding after closing', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $body = $(document.body)

    $body.css('padding-right', '5%')

    $('<div id="drawer-test"/>')
      .on('hidden.uni.drawer', function () {
        assert.strictEqual($body[0].style.paddingRight, '5%', 'body does not have inline padding set')
        $body.removeAttr('style')
        done()
      })
      .on('shown.uni.drawer', function () {
        $(this).unikornDrawer('hide')
      })
      .unikornDrawer('show')
  })

  test('should not follow link in area tag', (assert) => {
    assert.expect(2)
    var done = assert.async()

    $('<map><area id="test" shape="default" data-toggle="drawer" data-target="#drawer-test" href="demo.html"/></map>')
      .appendTo('#qunit-fixture')

    $('<div id="drawer-test"><div class="contents"><div id="close" data-dismiss="drawer"/></div></div>')
      .appendTo('#qunit-fixture')

    $('#test')
      .on('click.uni.drawer.data-api', function (event) {
        assert.notOk(event.isDefaultPrevented(), 'navigating to href will happen')

        setTimeout(function () {
          assert.ok(event.isDefaultPrevented(), 'model shown instead of navigating to href')
          done()
        }, 1)
      })
      .trigger('click')
  })

  test('should not parse target as html', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $toggleBtn = $('<button data-toggle="drawer" data-target="&lt;div id=&quot;drawer-test&quot;&gt;&lt;div class=&quot;contents&quot;&lt;div&lt;div id=&quot;close&quot; data-dismiss=&quot;drawer&quot;/&gt;&lt;/div&gt;&lt;/div&gt;"/>')
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')
    setTimeout(function () {
      assert.strictEqual($('#drawer-test').length, 0, 'target has not been parsed and added to the document')
      done()
    }, 0)
  })

  test('should not execute js from target', (assert) => {
    assert.expect(0)
    var done = assert.async()

    // This toggle button contains XSS payload in its data-target
    // Note: it uses the onerror handler of an img element to execute the js, because a simple script element does not work here
    //       a script element works in manual tests though, so here it is likely blocked by the qunit framework
    var $toggleBtn = $('<button data-toggle="drawer" data-target="&lt;div&gt;&lt;image src=&quot;missing.png&quot; onerror=&quot;$(&apos;#qunit-fixture button.control&apos;).trigger(&apos;click&apos;)&quot;&gt;&lt;/div&gt;"/>')
      .appendTo('#qunit-fixture')
    // The XSS payload above does not have a closure over this function and cannot access the assert object directly
    // However, it can send a click event to the following control button, which will then fail the assert
    $('<button>')
      .addClass('control')
      .on('click', function () {
        assert.notOk(true, 'XSS payload is not executed as js')
      })
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')

    setTimeout(done, 500)
  })

  test('should not try to open a drawer which is already visible', (assert) => {
    assert.expect(1)
    var done = assert.async()
    var count = 0

    $('<div id="drawer-test"/>')
      .on('shown.uni.drawer', function () {
        count++
      })
      .on('hidden.uni.drawer', function () {
        assert.strictEqual(count, 1, 'show() runs only once')
        done()
      })
      .unikornDrawer('show')
      .unikornDrawer('show')
      .unikornDrawer('hide')
  })

  test('transition duration should be the drawer-dialog duration before triggering shown event', (assert) => {
    assert.expect(1)
    var done = assert.async()
    var style = [
      '<style>',
      '  .drawer.fade .drawer-dialog {',
      '    transition: -webkit-transform .3s ease-out;',
      '    transition: transform .3s ease-out;',
      '    transition: transform .3s ease-out,-webkit-transform .3s ease-out;',
      '    -webkit-transform: translate(0,-50px);',
      '    transform: translate(0,-50px);',
      '  }',
      '</style>'
    ].join('')

    var $style = $(style).appendTo('head')
    var drawerHTML = [
      '<div class="drawer fade" id="exampleDrawer" tabindex="-1" role="dialog" aria-labelledby="exampleDrawerLabel" aria-hidden="true">',
      '<div class="drawer-dialog" role="document">',
      '<div class="drawer-content">',
      '<div class="drawer-body">...</div>',
      '</div>',
      '</div>',
      '</div>'
    ].join('')

    var $drawer = $(drawerHTML).appendTo('#qunit-fixture')
    var expectedTransitionDuration = 300
    var spy = sinon.spy(Util, 'getTransitionDurationFromElement')

    $drawer.on('shown.uni.drawer', function () {
      assert.ok(spy.returned(expectedTransitionDuration))
      $style.remove()
      spy.restore()
      done()
    })
      .unikornDrawer('show')
  })

  test('should dispose drawer', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var $drawer = $([
      '<div id="drawer-test">',
      '  <div class="drawer-dialog">',
      '    <div class="drawer-content">',
      '      <div class="drawer-body" />',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')).appendTo('#qunit-fixture')

    $drawer.on('shown.uni.drawer', function () {
      var spy = sinon.spy($.fn, 'off')

      $(this).unikornDrawer('dispose')

      var drawerDataApiEvent = []
      $._data(document, 'events').click
        .forEach(function (e) {
          if (e.namespace === 'data-api.drawer.uni') {
            drawerDataApiEvent.push(e)
          }
        })

      assert.ok(typeof $(this).data('uni.drawer') === 'undefined', 'drawer data object was disposed')
      assert.ok(spy.callCount === 4, '`jQuery.off` was called')
      assert.ok(drawerDataApiEvent.length === 1, '`Event.CLICK_DATA_API` on `document` was not removed')

      $.fn.off.restore()
      done()
    }).unikornDrawer('show')
  })

  test('should enforce focus', (assert) => {
    assert.expect(4)
    var done = assert.async()

    var $drawer = $([
      '<div id="drawer-test" data-show="false">',
      '  <div class="drawer-dialog">',
      '    <div class="drawer-content">',
      '      <div class="drawer-body" />',
      '    </div>',
      '  </div>',
      '</div>'
    ].join(''))
      .unikornDrawer()
      .appendTo('#qunit-fixture')

    var drawer = $drawer.data('uni.drawer')
    var spy = sinon.spy(drawer, '_enforceFocus')
    var spyDocOff = sinon.spy($(document), 'off')
    var spyDocOn = sinon.spy($(document), 'on')

    $drawer.one('shown.uni.drawer', function () {
      assert.ok(spy.called, '_enforceFocus called')
      assert.ok(spyDocOff.withArgs('focusin.uni.drawer'))
      assert.ok(spyDocOn.withArgs('focusin.uni.drawer'))

      var spyFocus = sinon.spy(drawer._element, 'focus')
      var event = $.Event('focusin', {
        target: $('#qunit-fixture')[0]
      })

      $(document).one('focusin', function () {
        assert.ok(spyFocus.called)
        done()
      })

      $(document).trigger(event)
    })
      .unikornDrawer('show')
  })

  test('should scroll to top of the drawer body if the drawer has .drawer-dialog-scrollable class', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $drawer = $([
      '<div id="drawer-test">',
      '  <div class="drawer-dialog drawer-dialog-scrollable">',
      '    <div class="drawer-content">',
      '      <div class="drawer-body" style="height: 100px; overflow-y: auto;">',
      '        <div style="height: 200px" />',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')).appendTo('#qunit-fixture')

    var $drawerBody = $('.drawer-body')
    $drawerBody.scrollTop(100)
    assert.ok($drawerBody.scrollTop() > 95 && $drawerBody.scrollTop() <= 100)

    $drawer.on('shown.uni.drawer', function () {
      assert.strictEqual($drawerBody.scrollTop(), 0, 'drawer body scrollTop should be 0 when opened')
      done()
    })
      .unikornDrawer('show')
  })

  test('should set .drawer\'s scroll top to 0 if .drawer-dialog-scrollable and drawer body do not exists', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $drawer = $([
      '<div id="drawer-test">',
      '  <div class="drawer-dialog drawer-dialog-scrollable">',
      '    <div class="drawer-content">',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')).appendTo('#qunit-fixture')


    $drawer.on('shown.uni.drawer', function () {
      assert.strictEqual($drawer.scrollTop(), 0)
      done()
    })
      .unikornDrawer('show')
  })
})
