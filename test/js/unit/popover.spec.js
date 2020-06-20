$(() => {
  const { module, test } = QUnit

  window.Popover = typeof unikorn !== 'undefined' ? unikorn.Popover : Popover

  module('popover plugin', () => {
    test('should return `Popover` plugin version', (assert) => {
      assert.expect(1)
      assert.strictEqual(typeof Popover.VERSION, 'string')
    })

    test('should be defined on jquery object', (assert) => {
      assert.expect(1)
      assert.ok($(document.body).popover, 'popover method is defined')
    })
  })

  module('popover', {
    beforeEach: () => {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.unikornPopover = $.fn.popover.noConflict()
    },
    afterEach: () => {
      $.fn.popover = $.fn.unikornPopover
      delete $.fn.unikornPopover
      $('.popover').remove()
      $('#qunit-fixture').html('')
    }
  })

  test('should provide no conflict', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.popover, 'undefined', 'popover was set back to undefined (org value)')
  })

  test('should throw explicit error on undefined method', (assert) => {
    assert.expect(1)

    var $el = $('<div/>')

    $el.unikornPopover()
    try {
      $el.unikornPopover('noMethod')
    } catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  test('should return jquery collection containing the element', (assert) => {
    assert.expect(2)

    var $el = $('<div/>')
    var $popover = $el.unikornPopover()

    assert.ok($popover instanceof $, 'returns jquery collection')
    assert.strictEqual($popover[0], $el[0], 'collection contains element')
  })

  test('should render popover element', (assert) => {
    assert.expect(2)
    var done = assert.async()

    $('<a href="#" title="uni" data-content="https://twitter.com/uni">@uni</a>')
      .appendTo('#qunit-fixture')
      .on('shown.uni.popover', function () {
        assert.notStrictEqual($('.popover').length, 0, 'popover was inserted')
        $(this).unikornPopover('hide')
      })
      .on('hidden.uni.popover', function () {
        assert.strictEqual($('.popover').length, 0, 'popover removed')
        done()
      })
      .unikornPopover('show')
  })

  test('should store popover instance in popover data object', (assert) => {
    assert.expect(1)

    var $popover = $('<a href="#" title="uni" data-content="https://twitter.com/uni">@uni</a>').unikornPopover()

    assert.ok($popover.data('uni.popover'), 'popover instance exists')
  })

  test('should store popover trigger in popover instance data object', (assert) => {
    assert.expect(1)

    var $popover = $('<a href="#" title="ResentedHook">@ResentedHook</a>')
      .appendTo('#qunit-fixture')
      .unikornPopover()

    $popover.unikornPopover('show')

    assert.ok($('.popover').data('uni.popover'), 'popover trigger stored in instance data')
  })

  test('should get title and content from options', (assert) => {
    assert.expect(4)
    var done = assert.async()

    var $popover = $('<a href="#">@fat</a>')
      .appendTo('#qunit-fixture')
      .unikornPopover({
        title: function () {
          return '@fat'
        },
        content: function () {
          return 'loves writing tests （╯°□°）╯︵ ┻━┻'
        }
      })

    $popover
      .one('shown.uni.popover', function () {
        assert.notStrictEqual($('.popover').length, 0, 'popover was inserted')
        assert.strictEqual($('.popover .popover-header').text(), '@fat', 'title correctly inserted')
        assert.strictEqual($('.popover .popover-body').text(), 'loves writing tests （╯°□°）╯︵ ┻━┻', 'content correctly inserted')
        $popover.unikornPopover('hide')
      })
      .one('hidden.uni.popover', function () {
        assert.strictEqual($('.popover').length, 0, 'popover was removed')
        done()
      })
      .unikornPopover('show')
  })

  test('should allow DOMElement title and content (html: true)', (assert) => {
    assert.expect(5)

    var title = document.createTextNode('@glebm <3 writing tests')
    var content = $('<i>¯\\_(ツ)_/¯</i>').get(0)
    var $popover = $('<a href="#" rel="tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornPopover({ html: true, title: title, content: content })

    $popover.unikornPopover('show')

    assert.notStrictEqual($('.popover').length, 0, 'popover inserted')
    assert.strictEqual($('.popover .popover-header').text(), '@glebm <3 writing tests', 'title inserted')
    assert.ok($.contains($('.popover').get(0), title), 'title node moved, not copied')
    // toLowerCase because IE8 will return <I>...</I>
    assert.strictEqual($('.popover .popover-body').html().toLowerCase(), '<i>¯\\_(ツ)_/¯</i>', 'content inserted')
    assert.ok($.contains($('.popover').get(0), content), 'content node moved, not copied')
  })

  test('should allow DOMElement title and content (html: false)', (assert) => {
    assert.expect(5)

    var title = document.createTextNode('@glebm <3 writing tests')
    var content = $('<i>¯\\_(ツ)_/¯</i>').get(0)
    var $popover = $('<a href="#" rel="tooltip"/>')
      .appendTo('#qunit-fixture')
      .unikornPopover({ title: title, content: content })

    $popover.unikornPopover('show')

    assert.notStrictEqual($('.popover').length, 0, 'popover inserted')
    assert.strictEqual($('.popover .popover-header').text(), '@glebm <3 writing tests', 'title inserted')
    assert.ok(!$.contains($('.popover').get(0), title), 'title node copied, not moved')
    assert.strictEqual($('.popover .popover-body').html(), '¯\\_(ツ)_/¯', 'content inserted')
    assert.ok(!$.contains($('.popover').get(0), content), 'content node copied, not moved')
  })

  test('should not duplicate HTML object', (assert) => {
    assert.expect(6)
    var done = assert.async()

    var $div = $('<div/>').html('loves writing tests （╯°□°）╯︵ ┻━┻')

    var $popover = $('<a href="#">@fat</a>')
      .appendTo('#qunit-fixture')
      .unikornPopover({
        html: true,
        content: function () {
          return $div
        }
      })

    function popoverInserted() {
      assert.notStrictEqual($('.popover').length, 0, 'popover was inserted')
      assert.equal($('.popover .popover-body').html(), $div[0].outerHTML, 'content correctly inserted')
    }

    $popover
      .one('shown.uni.popover', function () {
        popoverInserted()

        $popover.one('hidden.uni.popover', function () {
          assert.strictEqual($('.popover').length, 0, 'popover was removed')

          $popover.one('shown.uni.popover', function () {
            popoverInserted()

            $popover.one('hidden.uni.popover', function () {
              assert.strictEqual($('.popover').length, 0, 'popover was removed')
              done()
            }).unikornPopover('hide')
          }).unikornPopover('show')
        }).unikornPopover('hide')
      })
      .unikornPopover('show')
  })

  test('should get title and content from attributes', (assert) => {
    assert.expect(4)
    var done = assert.async()

    var $popover = $('<a href="#" title="@uni" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻" >@uni</a>')
      .appendTo('#qunit-fixture')
      .unikornPopover()
      .one('shown.uni.popover', function () {
        assert.notStrictEqual($('.popover').length, 0, 'popover was inserted')
        assert.strictEqual($('.popover .popover-header').text(), '@uni', 'title correctly inserted')
        assert.strictEqual($('.popover .popover-body').text(), 'loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻', 'content correctly inserted')
        $popover.unikornPopover('hide')
      })
      .one('hidden.uni.popover', function () {
        assert.strictEqual($('.popover').length, 0, 'popover was removed')
        done()
      })
      .unikornPopover('show')
  })

  test('should get title and content from attributes ignoring options passed via js', (assert) => {
    assert.expect(4)
    var done = assert.async()

    var $popover = $('<a href="#" title="@uni" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻" >@uni</a>')
      .appendTo('#qunit-fixture')
      .unikornPopover({
        title: 'ignored title option',
        content: 'ignored content option'
      })
      .one('shown.uni.popover', function () {
        assert.notStrictEqual($('.popover').length, 0, 'popover was inserted')
        assert.strictEqual($('.popover .popover-header').text(), '@uni', 'title correctly inserted')
        assert.strictEqual($('.popover .popover-body').text(), 'loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻', 'content correctly inserted')
        $popover.unikornPopover('hide')
      })
      .one('hidden.uni.popover', function () {
        assert.strictEqual($('.popover').length, 0, 'popover was removed')
        done()
      })
      .unikornPopover('show')
  })

  test('should respect custom template', (assert) => {
    assert.expect(3)
    var done = assert.async()

    var $popover = $('<a href="#">@fat</a>')
      .appendTo('#qunit-fixture')
      .unikornPopover({
        title: 'Test',
        content: 'Test',
        template: '<div class="popover foobar"><div class="arrow"></div><div class="inner"><h3 class="title"/><div class="content"><p/></div></div></div>'
      })
      .one('shown.uni.popover', function () {
        assert.notStrictEqual($('.popover').length, 0, 'popover was inserted')
        assert.ok($('.popover').hasClass('foobar'), 'custom class is present')
        $popover.unikornPopover('hide')
      })
      .one('hidden.uni.popover', function () {
        assert.strictEqual($('.popover').length, 0, 'popover was removed')
        done()
      })
      .unikornPopover('show')
  })

  test('should destroy popover', (assert) => {
    assert.expect(7)

    var $popover = $('<div/>')
      .unikornPopover({
        trigger: 'hover'
      })
      .on('click.foo', $.noop)

    assert.ok($popover.data('uni.popover'), 'popover has data')
    assert.ok($._data($popover[0], 'events').mouseover && $._data($popover[0], 'events').mouseout, 'popover has hover event')
    assert.strictEqual($._data($popover[0], 'events').click[0].namespace, 'foo', 'popover has extra click.foo event')

    $popover.unikornPopover('show')
    $popover.unikornPopover('dispose')

    assert.ok(!$popover.hasClass('show'), 'popover is hidden')
    assert.ok(!$popover.data('popover'), 'popover does not have data')
    assert.strictEqual($._data($popover[0], 'events').click[0].namespace, 'foo', 'popover still has click.foo')
    assert.ok(!$._data($popover[0], 'events').mouseover && !$._data($popover[0], 'events').mouseout, 'popover does not have any events')
  })

  test('should render popover element using delegated selector', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $div = $('<div><a href="#" title="uni" data-content="https://twitter.com/uni">@uni</a></div>')
      .appendTo('#qunit-fixture')
      .unikornPopover({
        selector: 'a',
        trigger: 'click'
      })
      .one('shown.uni.popover', function () {
        assert.notEqual($('.popover').length, 0, 'popover was inserted')
        $div.find('a').trigger('click')
      })
      .one('hidden.uni.popover', function () {
        assert.strictEqual($('.popover').length, 0, 'popover was removed')
        done()
      })

    $div.find('a').trigger('click')
  })

  test('should detach popover content rather than removing it so that event handlers are left intact', (assert) => {
    assert.expect(1)

    var $content = $('<div class="content-with-handler"><a class="btn btn-warning">Button with event handler</a></div>').appendTo('#qunit-fixture')

    var handlerCalled = false
    $('.content-with-handler .btn').on('click', function () {
      handlerCalled = true
    })

    var $div = $('<div><a href="#">Show popover</a></div>')
      .appendTo('#qunit-fixture')
      .unikornPopover({
        html: true,
        trigger: 'manual',
        container: 'body',
        animation: false,
        content: function () {
          return $content
        }
      })

    var done = assert.async()

    $div
      .one('shown.uni.popover', function () {
        $div
          .one('hidden.uni.popover', function () {
            $div
              .one('shown.uni.popover', function () {
                $('.content-with-handler .btn').trigger('click')
                assert.ok(handlerCalled, 'content\'s event handler still present')
                $div.unikornPopover('dispose')
                done()
              })
              .unikornPopover('show')
          })
          .unikornPopover('hide')
      })
      .unikornPopover('show')
  })

  test('should do nothing when an attempt is made to hide an uninitialized popover', (assert) => {
    assert.expect(1)

    var $popover = $('<span data-toggle="popover" data-title="some title" data-content="some content">some text</span>')
      .appendTo('#qunit-fixture')
      .on('hidden.uni.popover shown.uni.popover', function () {
        assert.ok(false, 'should not fire any popover events')
      })
      .unikornPopover('hide')

    assert.strictEqual(typeof $popover.data('uni.popover'), 'undefined', 'should not initialize the popover')
  })

  test('should fire inserted event', (assert) => {
    assert.expect(2)
    var done = assert.async()

    $('<a href="#">@Johann-S</a>')
      .appendTo('#qunit-fixture')
      .on('inserted.uni.popover', function () {
        assert.notEqual($('.popover').length, 0, 'popover was inserted')
        assert.ok(true, 'inserted event fired')
        done()
      })
      .unikornPopover({
        title: 'Test',
        content: 'Test'
      })
      .unikornPopover('show')
  })

  test('should throw an error when show is called on hidden elements', (assert) => {
    assert.expect(1)
    var done = assert.async()

    try {
      $('<div data-toggle="popover" data-title="some title" data-content="@Johann-S" style="display: none"/>').unikornPopover('show')
    } catch (err) {
      assert.strictEqual(err.message, 'Please use show on visible elements')
      done()
    }
  })

  test('should hide popovers when their containing modal is closed', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var templateHTML = '<div id="modal-test" class="modal">' +
        '<div class="modal-dialog" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-body">' +
        '<button id="popover-test" type="button" class="btn btn-secondary" data-toggle="popover" data-placement="top" data-content="Popover">' +
        'Popover on top' +
        '</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    $(templateHTML).appendTo('#qunit-fixture')

    $('#popover-test')
      .on('shown.uni.popover', function () {
        $('#modal-test').modal('hide')
      })
      .on('hide.uni.popover', function () {
        assert.ok(true, 'popover hide')
        done()
      })

    $('#modal-test')
      .on('shown.uni.modal', function () {
        $('#popover-test').unikornPopover('show')
      })
      .modal('show')
  })

  test('should convert number to string without error for content and title', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $popover = $('<a href="#">@uni</a>')
      .appendTo('#qunit-fixture')
      .unikornPopover({
        title: 5,
        content: 7
      })
      .on('shown.uni.popover', function () {
        assert.strictEqual($('.popover .popover-header').text(), '5')
        assert.strictEqual($('.popover .popover-body').text(), '7')
        done()
      })

    $popover.unikornPopover('show')
  })

  test('popover should be shown right away after the call of disable/enable', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var $popover = $('<a href="#">@uni</a>')
      .appendTo('#qunit-fixture')
      .unikornPopover({
        title: 'Test popover',
        content: 'with disable/enable'
      })
      .on('shown.uni.popover', function () {
        assert.strictEqual($('.popover').hasClass('show'), true)
        done()
      })

    $popover.unikornPopover('disable')
    $popover.trigger($.Event('click'))
    setTimeout(function () {
      assert.strictEqual($('.popover').length === 0, true)
      $popover.unikornPopover('enable')
      $popover.trigger($.Event('click'))
    }, 200)
  })

  test('popover should call content function only once', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var nbCall = 0
    $('<div id="popover" style="display:none">content</div>').appendTo('#qunit-fixture')
    var $popover = $('<a href="#">@Johann-S</a>')
      .appendTo('#qunit-fixture')
      .unikornPopover({
        content: function () {
          nbCall++
          return $('#popover').clone().show().get(0)
        }
      })
      .on('shown.uni.popover', function () {
        assert.strictEqual(nbCall, 1)
        done()
      })

    $popover.trigger($.Event('click'))
  })
})
