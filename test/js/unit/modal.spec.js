$(function () {
  'use strict'

  const { module, test } = QUnit
  const $modalScrollbarMeasure = $('<style> .modal-scrollbar-measure { position: absolute; top: -9999px; width: 50px; height: 50px; overflow: scroll; } </style>')

  window.Modal = typeof unikorn !== 'undefined' ? unikorn.Modal : Modal

  module('modal plugin', () => {
    test('should be defined on jquery object', (assert) => {
      assert.expect(1)
      assert.ok($(document.body).modal, 'modal method is defined')
    })
  })

  module('modal', {
    before: () => {
      // Enable the scrollbar measurer
      $modalScrollbarMeasure.appendTo('head')
      // Function to calculate the scrollbar width which is then compared to the padding or margin changes
      $.fn.getScrollbarWidth = $.fn.modal.Constructor.prototype._getScrollbarWidth

      // Simulate scrollbars
      $('html').css('padding-right', '16px')
    },
    beforeEach: () => {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.unikornModal = $.fn.modal.noConflict()
    },
    afterEach: () => {
      $('.modal-backdrop, #modal-test').remove()
      $(document.body).removeClass('modal-open')
      $.fn.modal = $.fn.unikornModal
      delete $.fn.unikornModal
      $('#qunit-fixture').html('')
    },
    after: () => {
      // Disable the scrollbar measurer
      $modalScrollbarMeasure.remove()
      // Restore scrollbars
      $('html').removeAttr('style')
      // $('body').removeAttr('class style')
    }
  })

  test('should provide no conflict', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.modal, 'undefined', 'modal was set back to undefined (orig value)')
  })

  test('should return modal version', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof Modal.VERSION, 'string')
  })

  test('should throw explicit error on undefined method', (assert) => {
    assert.expect(1)

    var $el = $('<div id="modal-test"/>')

    $el.unikornModal()
    try {
      $el.unikornModal('noMethod')
    } catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  test('should return jquery collection containing the element', (assert) => {
    assert.expect(2)

    var $el = $('<div id="modal-test"/>')
    var $modal = $el.unikornModal()

    assert.ok($modal instanceof $, 'returns jquery collection')
    assert.strictEqual($modal[0], $el[0], 'collection contains element')
  })

  test('should expose defaults var for settings', (assert) => {
    assert.expect(1)
    assert.ok($.fn.unikornModal.Constructor.Default, 'default object exposed')
  })

  test('should insert into dom when show method is called', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.uni.modal', function () {
        assert.notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        done()
      })
      .unikornModal('show')
  })

  test('should fire show event', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('show.uni.modal', function () {
        assert.ok(true, 'show event fired')
        done()
      })
      .unikornModal('show')
  })

  test('should not fire shown when show was prevented', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('show.uni.modal', function (e) {
        e.preventDefault()
        assert.ok(true, 'show event fired')
        done()
      })
      .on('shown.uni.modal', function () {
        assert.ok(false, 'shown event fired')
      })
      .unikornModal('show')
  })

  test('should hide modal when hide is called', (assert) => {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.uni.modal', function () {
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        assert.notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $(this).unikornModal('hide')
      })
      .on('hidden.uni.modal', function () {
        assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .unikornModal('show')
  })

  test('should toggle when toggle is called', (assert) => {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.uni.modal', function () {
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        assert.notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $(this).unikornModal('toggle')
      })
      .on('hidden.uni.modal', function () {
        assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .unikornModal('toggle')
  })

  test('should remove from dom when click [data-dismiss="modal"]', (assert) => {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"><span class="close" data-dismiss="modal"/></div>')
      .on('shown.uni.modal', function () {
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        assert.notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $(this).find('.close').trigger('click')
      })
      .on('hidden.uni.modal', function () {
        assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .unikornModal('toggle')
  })

  test('should allow modal close with [data-backdrop="false"]', (assert) => {
    assert.expect(2)
    var done = assert.async()

    $('<div id="modal-test" data-backdrop="false"/>')
      .on('shown.uni.modal', function () {
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        $(this).unikornModal('hide')
      })
      .on('hidden.uni.modal', function () {
        assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .unikornModal('show')
  })

  test('should close modal when clicking outside of modal-content', (assert) => {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"><div class="contents"/></div>')
      .on('shown.uni.modal', function () {
        assert.notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $('.contents').trigger('click')
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        $('#modal-test').trigger('click')
      })
      .on('hidden.uni.modal', function () {
        assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .unikornModal('show')
  })

  test('should not close modal when clicking outside of modal-content if [data-backdrop="true"]', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test" data-backdrop="false"><div class="contents"/></div>')
      .on('shown.uni.modal', function () {
        $('#modal-test').trigger('click')
        assert.ok($('#modal-test').is(':visible'), 'modal not hidden')
        done()
      })
      .unikornModal('show')
  })

  test('should close modal when escape key is pressed via keydown', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var $div = $('<div id="modal-test"/>')
    $div
      .on('shown.uni.modal', function () {
        assert.ok($('#modal-test').length, 'modal inserted into dom')
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        $div.trigger($.Event('keydown', { which: 27 }))

        setTimeout(function () {
          assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
          $div.remove()
          done()
        }, 0)
      })
      .unikornModal('show')
  })

  test('should not close modal when escape key is pressed via keyup', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var $div = $('<div id="modal-test"/>')
    $div
      .on('shown.uni.modal', function () {
        assert.ok($('#modal-test').length, 'modal inserted into dom')
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        $div.trigger($.Event('keyup', { which: 27 }))

        setTimeout(function () {
          assert.ok($div.is(':visible'), 'modal still visible')
          $div.remove()
          done()
        }, 0)
      })
      .unikornModal('show')
  })

  test('should trigger hide event once when clicking outside of modal-content', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var triggered

    $('<div id="modal-test"><div class="contents"/></div>')
      .on('shown.uni.modal', function () {
        triggered = 0
        $('#modal-test').trigger('click')
      })
      .on('hide.uni.modal', function () {
        triggered += 1
        assert.strictEqual(triggered, 1, 'modal hide triggered once')
        done()
      })
      .unikornModal('show')
  })

  test('should remove aria-hidden attribute when shown, add it back when hidden', (assert) => {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test" aria-hidden="true"/>')
      .on('shown.uni.modal', function () {
        assert.notOk($('#modal-test').is('[aria-hidden]'), 'aria-hidden attribute removed')
        $(this).unikornModal('hide')
      })
      .on('hidden.uni.modal', function () {
        assert.ok($('#modal-test').is('[aria-hidden]'), 'aria-hidden attribute added')
        assert.strictEqual($('#modal-test').attr('aria-hidden'), 'true', 'correct aria-hidden="true" added')
        done()
      })
      .unikornModal('show')
  })

  test('should add aria-modal attribute when shown, remove it again when hidden', (assert) => {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.uni.modal', function () {
        assert.ok($('#modal-test').is('[aria-modal]'), 'aria-modal attribute added')
        assert.strictEqual($('#modal-test').attr('aria-modal'), 'true', 'correct aria-modal="true" added')
        $(this).unikornModal('hide')
      })
      .on('hidden.uni.modal', function () {
        assert.notOk($('#modal-test').is('[aria-modal]'), 'aria-modal attribute removed')
        done()
      })
      .unikornModal('show')
  })

  test('should close reopened modal with [data-dismiss="modal"] click', (assert) => {
    assert.expect(2)
    var done = assert.async()

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>')
      .one('shown.uni.modal', function () {
        $('#close').trigger('click')
      })
      .one('hidden.uni.modal', function () {
        // After one open-close cycle
        assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
        $(this)
          .one('shown.uni.modal', function () {
            $('#close').trigger('click')
          })
          .one('hidden.uni.modal', function () {
            assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
            done()
          })
          .unikornModal('show')
      })
      .unikornModal('show')
  })

  test('should restore focus to toggling element when modal is hidden after having been opened via data-api', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $toggleBtn = $('<button data-toggle="modal" data-target="#modal-test"/>').appendTo('#qunit-fixture')

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>')
      .on('hidden.uni.modal', function () {
        setTimeout(function () {
          assert.ok($(document.activeElement).is($toggleBtn), 'toggling element is once again focused')
          done()
        }, 0)
      })
      .on('shown.uni.modal', function () {
        $('#close').trigger('click')
      })
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')
  })

  test('should not restore focus to toggling element if the associated show event gets prevented', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $toggleBtn = $('<button data-toggle="modal" data-target="#modal-test"/>').appendTo('#qunit-fixture')
    var $otherBtn = $('<button id="other-btn"/>').appendTo('#qunit-fixture')

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div>')
      .one('show.uni.modal', function (e) {
        e.preventDefault()
        $otherBtn.trigger('focus')
        setTimeout($.proxy(function () {
          $(this).unikornModal('show')
        }, this), 0)
      })
      .on('hidden.uni.modal', function () {
        setTimeout(function () {
          assert.ok($(document.activeElement).is($otherBtn), 'focus returned to toggling element')
          done()
        }, 0)
      })
      .on('shown.uni.modal', function () {
        $('#close').trigger('click')
      })
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')
  })

  test('should adjust the inline padding of the modal when opening', (assert) => {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.uni.modal', function () {
        var expectedPadding = $(this).getScrollbarWidth() + 'px'
        var currentPadding = $(this).css('padding-right')
        assert.strictEqual(currentPadding, expectedPadding, 'modal padding should be adjusted while opening')
        done()
      })
      .unikornModal('show')
  })

  test('should adjust the inline body padding when opening and restore when closing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $body = $(document.body)
    var originalPadding = $body.css('padding-right')

    $('<div id="modal-test"/>')
      .on('hidden.uni.modal', function () {
        var currentPadding = $body.css('padding-right')
        assert.strictEqual(currentPadding, originalPadding, 'body padding should be reset after closing')
        $body.removeAttr('style')
        done()
      })
      .on('shown.uni.modal', function () {
        var expectedPadding = parseFloat(originalPadding) + $(this).getScrollbarWidth() + 'px'
        var currentPadding = $body.css('padding-right')
        assert.strictEqual(currentPadding, expectedPadding, 'body padding should be adjusted while opening')
        $(this).unikornModal('hide')
      })
      .unikornModal('show')
  })

  test('should store the original body padding in data-padding-right before showing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $body = $(document.body)
    var originalPadding = '0px'
    $body.css('padding-right', originalPadding)

    $('<div id="modal-test"/>')
      .on('hidden.uni.modal', function () {
        assert.strictEqual(typeof $body.data('padding-right'), 'undefined', 'data-padding-right should be cleared after closing')
        $body.removeAttr('style')
        done()
      })
      .on('shown.uni.modal', function () {
        assert.strictEqual($body.data('padding-right'), originalPadding, 'original body padding should be stored in data-padding-right')
        $(this).unikornModal('hide')
      })
      .unikornModal('show')
  })

  test('should not adjust the inline body padding when it does not overflow', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $body = $(document.body)
    var originalPadding = $body.css('padding-right')

    // Hide scrollbars to prevent the body overflowing
    $body.css('overflow', 'hidden')        // Real scrollbar (for in-browser testing)
    $('html').css('padding-right', '0px')  // Simulated scrollbar (for PhantomJS)

    $('<div id="modal-test"/>')
      .on('shown.uni.modal', function () {
        var currentPadding = $body.css('padding-right')
        assert.strictEqual(currentPadding, originalPadding, 'body padding should not be adjusted')
        $(this).unikornModal('hide')

        // Restore scrollbars
        $body.css('overflow', 'auto')
        $('html').css('padding-right', '16px')
        done()
      })
      .unikornModal('show')
  })

  test('should adjust the inline padding of fixed elements when opening and restore when closing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $element = $('<div class="fixed-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = $element.css('padding-right')

    $('<div id="modal-test"/>')
      .on('hidden.uni.modal', function () {
        var currentPadding = $element.css('padding-right')
        assert.strictEqual(currentPadding, originalPadding, 'fixed element padding should be reset after closing')
        $element.remove()
        done()
      })
      .on('shown.uni.modal', function () {
        var expectedPadding = parseFloat(originalPadding) + $(this).getScrollbarWidth() + 'px'
        var currentPadding = $element.css('padding-right')
        assert.strictEqual(currentPadding, expectedPadding, 'fixed element padding should be adjusted while opening')
        $(this).unikornModal('hide')
      })
      .unikornModal('show')
  })

  test('should store the original padding of fixed elements in data-padding-right before showing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $element = $('<div class="fixed-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = '0px'
    $element.css('padding-right', originalPadding)

    $('<div id="modal-test"/>')
      .on('hidden.uni.modal', function () {
        assert.strictEqual(typeof $element.data('padding-right'), 'undefined', 'data-padding-right should be cleared after closing')
        $element.remove()
        done()
      })
      .on('shown.uni.modal', function () {
        assert.strictEqual($element.data('padding-right'), originalPadding, 'original fixed element padding should be stored in data-padding-right')
        $(this).unikornModal('hide')
      })
      .unikornModal('show')
  })

  test('should adjust the inline margin of sticky elements when opening and restore when closing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $element = $('<div class="sticky-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = $element.css('margin-right')

    $('<div id="modal-test"/>')
      .on('hidden.uni.modal', function () {
        var currentPadding = $element.css('margin-right')
        assert.strictEqual(currentPadding, originalPadding, 'sticky element margin should be reset after closing')
        $element.remove()
        done()
      })
      .on('shown.uni.modal', function () {
        var expectedPadding = parseFloat(originalPadding) - $(this).getScrollbarWidth() + 'px'
        var currentPadding = $element.css('margin-right')
        assert.strictEqual(currentPadding, expectedPadding, 'sticky element margin should be adjusted while opening')
        $(this).unikornModal('hide')
      })
      .unikornModal('show')
  })

  test('should store the original margin of sticky elements in data-margin-right before showing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $element = $('<div class="sticky-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = '0px'
    $element.css('margin-right', originalPadding)

    $('<div id="modal-test"/>')
      .on('hidden.uni.modal', function () {
        assert.strictEqual(typeof $element.data('margin-right'), 'undefined', 'data-margin-right should be cleared after closing')
        $element.remove()
        done()
      })
      .on('shown.uni.modal', function () {
        assert.strictEqual($element.data('margin-right'), originalPadding, 'original sticky element margin should be stored in data-margin-right')
        $(this).unikornModal('hide')
      })
      .unikornModal('show')
  })

  test('should ignore values set via CSS when trying to restore body padding after closing', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $body = $(document.body)
    var $style = $('<style>body { padding-right: 42px; }</style>').appendTo('head')

    $('<div id="modal-test"/>')
      .on('hidden.uni.modal', function () {
        assert.strictEqual($body.attr('style').indexOf('padding-right'), -1, 'body does not have inline padding set')
        $style.remove()
        done()
      })
      .on('shown.uni.modal', function () {
        $(this).unikornModal('hide')
      })
      .unikornModal('show')
  })

  test('should ignore other inline styles when trying to restore body padding after closing', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $body = $(document.body)
    var $style = $('<style>body { padding-right: 42px; }</style>').appendTo('head')

    $body.css('color', 'red')

    $('<div id="modal-test"/>')
      .on('hidden.uni.modal', function () {
        assert.strictEqual($body[0].style.paddingRight, '', 'body does not have inline padding set')
        assert.strictEqual($body[0].style.color, 'red', 'body still has other inline styles set')
        $body.removeAttr('style')
        $style.remove()
        done()
      })
      .on('shown.uni.modal', function () {
        $(this).unikornModal('hide')
      })
      .unikornModal('show')
  })

  test('should properly restore non-pixel inline body padding after closing', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $body = $(document.body)

    $body.css('padding-right', '5%')

    $('<div id="modal-test"/>')
      .on('hidden.uni.modal', function () {
        assert.strictEqual($body[0].style.paddingRight, '5%', 'body does not have inline padding set')
        $body.removeAttr('style')
        done()
      })
      .on('shown.uni.modal', function () {
        $(this).unikornModal('hide')
      })
      .unikornModal('show')
  })

  test('should not follow link in area tag', (assert) => {
    assert.expect(2)
    var done = assert.async()

    $('<map><area id="test" shape="default" data-toggle="modal" data-target="#modal-test" href="demo.html"/></map>')
      .appendTo('#qunit-fixture')

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>')
      .appendTo('#qunit-fixture')

    $('#test')
      .on('click.uni.modal.data-api', function (event) {
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

    var $toggleBtn = $('<button data-toggle="modal" data-target="&lt;div id=&quot;modal-test&quot;&gt;&lt;div class=&quot;contents&quot;&lt;div&lt;div id=&quot;close&quot; data-dismiss=&quot;modal&quot;/&gt;&lt;/div&gt;&lt;/div&gt;"/>')
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')
    setTimeout(function () {
      assert.strictEqual($('#modal-test').length, 0, 'target has not been parsed and added to the document')
      done()
    }, 0)
  })

  test('should not execute js from target', (assert) => {
    assert.expect(0)
    var done = assert.async()

    // This toggle button contains XSS payload in its data-target
    // Note: it uses the onerror handler of an img element to execute the js, because a simple script element does not work here
    //       a script element works in manual tests though, so here it is likely blocked by the qunit framework
    var $toggleBtn = $('<button data-toggle="modal" data-target="&lt;div&gt;&lt;image src=&quot;missing.png&quot; onerror=&quot;$(&apos;#qunit-fixture button.control&apos;).trigger(&apos;click&apos;)&quot;&gt;&lt;/div&gt;"/>')
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

  test('should not try to open a modal which is already visible', (assert) => {
    assert.expect(1)
    var done = assert.async()
    var count = 0

    $('<div id="modal-test"/>').on('shown.uni.modal', function () {
      count++
    }).on('hidden.uni.modal', function () {
      assert.strictEqual(count, 1, 'show() runs only once')
      done()
    })
      .unikornModal('show')
      .unikornModal('show')
      .unikornModal('hide')
  })

  test('transition duration should be the modal-dialog duration before triggering shown event', (assert) => {
    assert.expect(1)
    var done = assert.async()
    var style = [
      '<style>',
      '  .modal.fade .modal-dialog {',
      '    transition: -webkit-transform .3s ease-out;',
      '    transition: transform .3s ease-out;',
      '    transition: transform .3s ease-out,-webkit-transform .3s ease-out;',
      '    -webkit-transform: translate(0,-50px);',
      '    transform: translate(0,-50px);',
      '  }',
      '</style>'
    ].join('')

    var $style = $(style).appendTo('head')
    var modalHTML = [
      '<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">',
      '<div class="modal-dialog" role="document">',
      '<div class="modal-content">',
      '<div class="modal-body">...</div>',
      '</div>',
      '</div>',
      '</div>'
    ].join('')

    var $modal = $(modalHTML).appendTo('#qunit-fixture')
    var expectedTransitionDuration = 300
    var spy = sinon.spy(Util, 'getTransitionDurationFromElement')

    $modal.on('shown.uni.modal', function () {
      assert.ok(spy.returned(expectedTransitionDuration))
      $style.remove()
      spy.restore()
      done()
    })
      .unikornModal('show')
  })

  test('should dispose modal', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var $modal = $([
      '<div id="modal-test">',
      '  <div class="modal-dialog">',
      '    <div class="modal-content">',
      '      <div class="modal-body" />',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')).appendTo('#qunit-fixture')

    $modal.on('shown.uni.modal', function () {
      var spy = sinon.spy($.fn, 'off')

      $(this).unikornModal('dispose')

      var modalDataApiEvent = []
      $._data(document, 'events').click
        .forEach(function (e) {
          if (e.namespace === 'data-api.modal.uni') {
            modalDataApiEvent.push(e)
          }
        })

      assert.ok(typeof $(this).data('uni.modal') === 'undefined', 'modal data object was disposed')
      assert.ok(spy.callCount === 4, '`jQuery.off` was called')
      assert.ok(modalDataApiEvent.length === 1, '`Event.CLICK_DATA_API` on `document` was not removed')

      $.fn.off.restore()
      done()
    }).unikornModal('show')
  })

  test('should enforce focus', (assert) => {
    assert.expect(4)
    var done = assert.async()

    var $modal = $([
      '<div id="modal-test" data-show="false">',
      '  <div class="modal-dialog">',
      '    <div class="modal-content">',
      '      <div class="modal-body" />',
      '    </div>',
      '  </div>',
      '</div>'
    ].join(''))
      .unikornModal()
      .appendTo('#qunit-fixture')

    var modal = $modal.data('uni.modal')
    var spy = sinon.spy(modal, '_enforceFocus')
    var spyDocOff = sinon.spy($(document), 'off')
    var spyDocOn = sinon.spy($(document), 'on')

    $modal.one('shown.uni.modal', function () {
      assert.ok(spy.called, '_enforceFocus called')
      assert.ok(spyDocOff.withArgs('focusin.uni.modal'))
      assert.ok(spyDocOn.withArgs('focusin.uni.modal'))

      var spyFocus = sinon.spy(modal._element, 'focus')
      var event = $.Event('focusin', {
        target: $('#qunit-fixture')[0]
      })

      $(document).one('focusin', function () {
        assert.ok(spyFocus.called)
        done()
      })

      $(document).trigger(event)
    })
      .unikornModal('show')
  })

  test('should scroll to top of the modal body if the modal has .modal-dialog-scrollable class', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $modal = $([
      '<div id="modal-test">',
      '  <div class="modal-dialog modal-dialog-scrollable">',
      '    <div class="modal-content">',
      '      <div class="modal-body" style="height: 100px; overflow-y: auto;">',
      '        <div style="height: 200px" />',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')).appendTo('#qunit-fixture')

    var $modalBody = $('.modal-body')
    $modalBody.scrollTop(100)
    assert.ok($modalBody.scrollTop() > 95 && $modalBody.scrollTop() <= 100)

    $modal.on('shown.uni.modal', function () {
      assert.strictEqual($modalBody.scrollTop(), 0, 'modal body scrollTop should be 0 when opened')
      done()
    })
      .unikornModal('show')
  })

  test('should set .modal\'s scroll top to 0 if .modal-dialog-scrollable and modal body do not exists', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var $modal = $([
      '<div id="modal-test">',
      '  <div class="modal-dialog modal-dialog-scrollable">',
      '    <div class="modal-content">',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')).appendTo('#qunit-fixture')


    $modal.on('shown.uni.modal', function () {
      assert.strictEqual($modal.scrollTop(), 0)
      done()
    })
      .unikornModal('show')
  })
})
