$(function () {
  'use strict'

  const { module, test } = QUnit

  window.Tab = typeof unikorn !== 'undefined' ? unikorn.Tab : Tab

  module('tabs plugin', () => {
    test('should be defined on jquery object', (assert) => {
      assert.expect(1)
      assert.ok($(document.body).tab, 'tabs method is defined')
    })
  })

  module('tabs', {
    beforeEach: () => {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.unikornTab = $.fn.tab.noConflict()
    },
    afterEach: () => {
      $.fn.tab = $.fn.unikornTab
      delete $.fn.unikornTab
      $('#qunit-fixture').html('')
    }
  })

  test('should provide no conflict', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.tab, 'undefined', 'tab was set back to undefined (org value)')
  })

  test('should return tab version', (assert) => {
    assert.expect(1)
    assert.strictEqual(typeof Tab.VERSION, 'string')
  })

  test('should throw explicit error on undefined method', (assert) => {
    assert.expect(1)

    var $el = $('<div/>')
    $el.unikornTab()
    try {
      $el.unikornTab('noMethod')
    } catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  test('should return jquery collection containing the element', (assert) => {
    assert.expect(2)

    var $el = $('<div/>')
    var $tab = $el.unikornTab()
    assert.ok($tab instanceof $, 'returns jquery collection')
    assert.strictEqual($tab[0], $el[0], 'collection contains element')
  })

  test('should activate element by tab id', (assert) => {
    assert.expect(2)

    var tabsHTML = '<ul class="nav">' +
        '<li><a href="#home">Home</a></li>' +
        '<li><a href="#profile">Profile</a></li>' +
        '</ul>'

    $('<ul><li id="home"/><li id="profile"/></ul>').appendTo('#qunit-fixture')

    $(tabsHTML).find('li:last-child a').unikornTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(tabsHTML).find('li:first-child a').unikornTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  test('should activate element by tab id', (assert) => {
    assert.expect(2)

    var pillsHTML = '<ul class="nav nav-pills">' +
        '<li><a href="#home">Home</a></li>' +
        '<li><a href="#profile">Profile</a></li>' +
        '</ul>'

    $('<ul><li id="home"/><li id="profile"/></ul>').appendTo('#qunit-fixture')

    $(pillsHTML).find('li:last-child a').unikornTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(pillsHTML).find('li:first-child a').unikornTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  test('should activate element by tab id in ordered list', (assert) => {
    assert.expect(2)

    var pillsHTML = '<ol class="nav nav-pills">' +
        '<li><a href="#home">Home</a></li>' +
        '<li><a href="#profile">Profile</a></li>' +
        '</ol>'

    $('<ol><li id="home"/><li id="profile"/></ol>').appendTo('#qunit-fixture')

    $(pillsHTML).find('li:last-child a').unikornTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(pillsHTML).find('li:first-child a').unikornTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  test('should activate element by tab id in nav list', (assert) => {
    assert.expect(2)

    var tabsHTML = '<nav class="nav">' +
        '<a href="#home">Home</a>' +
        '<a href="#profile">Profile</a>' +
        '</nav>'

    $('<nav><div id="home"></div><div id="profile"></div></nav>').appendTo('#qunit-fixture')

    $(tabsHTML).find('a:last-child').unikornTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(tabsHTML).find('a:first-child').unikornTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  test('should activate element by tab id in list group', (assert) => {
    assert.expect(2)

    var tabsHTML = '<div class="list-group">' +
        '<a href="#home">Home</a>' +
        '<a href="#profile">Profile</a>' +
        '</div>'

    $('<nav><div id="home"></div><div id="profile"></div></nav>').appendTo('#qunit-fixture')

    $(tabsHTML).find('a:last-child').unikornTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(tabsHTML).find('a:first-child').unikornTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  test('should not fire shown when show is prevented', (assert) => {
    assert.expect(1)

    var done = assert.async()

    $('<div class="nav"/>')
      .on('show.uni.tab', function (e) {
        e.preventDefault()
        assert.ok(true, 'show event fired')
        done()
      })
      .on('shown.uni.tab', function () {
        assert.ok(false, 'shown event fired')
      })
      .unikornTab('show')
  })

  test('should not fire shown when tab is already active', (assert) => {
    assert.expect(0)

    var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
        '<li class="nav-item"><a href="#home" class="nav-link active" role="tab">Home</a></li>' +
        '<li class="nav-item"><a href="#profile" class="nav-link" role="tab">Profile</a></li>' +
        '</ul>' +
        '<div class="tab-content">' +
        '<div class="tab-pane active" id="home" role="tabpanel"></div>' +
        '<div class="tab-pane" id="profile" role="tabpanel"></div>' +
        '</div>'

    $(tabsHTML)
      .find('a.active')
      .on('shown.uni.tab', function () {
        assert.ok(true, 'shown event fired')
      })
      .unikornTab('show')
  })

  test('should not fire shown when tab is disabled', (assert) => {
    assert.expect(0)

    var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
        '<li class="nav-item"><a href="#home" class="nav-link active" role="tab">Home</a></li>' +
        '<li class="nav-item"><a href="#profile" class="nav-link disabled" role="tab">Profile</a></li>' +
        '</ul>' +
        '<div class="tab-content">' +
        '<div class="tab-pane active" id="home" role="tabpanel"></div>' +
        '<div class="tab-pane" id="profile" role="tabpanel"></div>' +
        '</div>'

    $(tabsHTML)
      .find('a.disabled')
      .on('shown.uni.tab', function () {
        assert.ok(true, 'shown event fired')
      })
      .unikornTab('show')
  })

  test('show and shown events should reference correct relatedTarget', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var dropHTML = '<ul class="drop nav">' +
        '<li class="dropdown"><a data-toggle="dropdown" href="#">1</a>' +
        '<ul class="dropdown-menu nav">' +
        '<li><a href="#a1-1" data-toggle="tab">1-1</a></li>' +
        '<li><a href="#a1-2" data-toggle="tab">1-2</a></li>' +
        '</ul>' +
        '</li>' +
        '</ul>'

    $(dropHTML)
      .find('ul > li:first-child a')
      .unikornTab('show')
      .end()
      .find('ul > li:last-child a')
      .on('show.uni.tab', function (e) {
        assert.strictEqual(e.relatedTarget.hash, '#a1-1', 'references correct element as relatedTarget')
      })
      .on('shown.uni.tab', function (e) {
        assert.strictEqual(e.relatedTarget.hash, '#a1-1', 'references correct element as relatedTarget')
        done()
      })
      .unikornTab('show')
  })

  test('should fire hide and hidden events', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var tabsHTML = '<ul class="nav">' +
        '<li><a href="#home">Home</a></li>' +
        '<li><a href="#profile">Profile</a></li>' +
        '</ul>'

    $(tabsHTML)
      .find('li:first-child a')
      .on('hide.uni.tab', function () {
        assert.ok(true, 'hide event fired')
      })
      .unikornTab('show')
      .end()
      .find('li:last-child a')
      .unikornTab('show')

    $(tabsHTML)
      .find('li:first-child a')
      .on('hidden.uni.tab', function () {
        assert.ok(true, 'hidden event fired')
        done()
      })
      .unikornTab('show')
      .end()
      .find('li:last-child a')
      .unikornTab('show')
  })

  test('should not fire hidden when hide is prevented', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var tabsHTML = '<ul class="nav">' +
        '<li><a href="#home">Home</a></li>' +
        '<li><a href="#profile">Profile</a></li>' +
        '</ul>'

    $(tabsHTML)
      .find('li:first-child a')
      .on('hide.uni.tab', function (e) {
        e.preventDefault()
        assert.ok(true, 'hide event fired')
        done()
      })
      .on('hidden.uni.tab', function () {
        assert.ok(false, 'hidden event fired')
      })
      .unikornTab('show')
      .end()
      .find('li:last-child a')
      .unikornTab('show')
  })

  test('hide and hidden events contain correct relatedTarget', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var tabsHTML = '<ul class="nav">' +
        '<li><a href="#home">Home</a></li>' +
        '<li><a href="#profile">Profile</a></li>' +
        '</ul>'

    $(tabsHTML)
      .find('li:first-child a')
      .on('hide.uni.tab', function (e) {
        assert.strictEqual(e.relatedTarget.hash, '#profile', 'references correct element as relatedTarget')
      })
      .on('hidden.uni.tab', function (e) {
        assert.strictEqual(e.relatedTarget.hash, '#profile', 'references correct element as relatedTarget')
        done()
      })
      .unikornTab('show')
      .end()
      .find('li:last-child a')
      .unikornTab('show')
  })

  test('selected tab should have aria-selected', (assert) => {
    assert.expect(8)

    var tabsHTML = '<ul class="nav nav-tabs">' +
        '<li><a class="nav-item active" href="#home" toggle="tab" aria-selected="true">Home</a></li>' +
        '<li><a class="nav-item" href="#profile" toggle="tab" aria-selected="false">Profile</a></li>' +
        '</ul>'
    var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

    $tabs.find('li:first-child a').unikornTab('show')
    assert.strictEqual($tabs.find('.active').attr('aria-selected'), 'true', 'shown tab has aria-selected = true')
    assert.strictEqual($tabs.find('a:not(.active)').attr('aria-selected'), 'false', 'hidden tab has aria-selected = false')

    $tabs.find('li:last-child a').trigger('click')
    assert.strictEqual($tabs.find('.active').attr('aria-selected'), 'true', 'after click, shown tab has aria-selected = true')
    assert.strictEqual($tabs.find('a:not(.active)').attr('aria-selected'), 'false', 'after click, hidden tab has aria-selected = false')

    $tabs.find('li:first-child a').unikornTab('show')
    assert.strictEqual($tabs.find('.active').attr('aria-selected'), 'true', 'shown tab has aria-selected = true')
    assert.strictEqual($tabs.find('a:not(.active)').attr('aria-selected'), 'false', 'hidden tab has aria-selected = false')

    $tabs.find('li:first-child a').trigger('click')
    assert.strictEqual($tabs.find('.active').attr('aria-selected'), 'true', 'after second show event, shown tab still has aria-selected = true')
    assert.strictEqual($tabs.find('a:not(.active)').attr('aria-selected'), 'false', 'after second show event, hidden tab has aria-selected = false')
  })

  test('selected tab should deactivate previous selected tab', (assert) => {
    assert.expect(2)

    var tabsHTML = '<ul class="nav nav-tabs">' +
        '<li class="nav-item"><a class="nav-link active" href="#home" data-toggle="tab">Home</a></li>' +
        '<li class="nav-item"><a class="nav-link" href="#profile" data-toggle="tab">Profile</a></li>' +
        '</ul>'
    var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

    $tabs.find('li:last-child a').trigger('click')
    assert.notOk($tabs.find('li:first-child a').hasClass('active'))
    assert.ok($tabs.find('li:last-child a').hasClass('active'))
  })

  test('selected tab should deactivate previous selected link in dropdown', (assert) => {
    assert.expect(3)

    var tabsHTML = '<ul class="nav nav-tabs">' +
        '<li class="nav-item"><a class="nav-link" href="#home" data-toggle="tab">Home</a></li>' +
        '<li class="nav-item"><a class="nav-link" href="#profile" data-toggle="tab">Profile</a></li>' +
        '<li class="nav-item dropdown"><a class="nav-link dropdown-toggle active" data-toggle="dropdown" href="#">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item active" href="#dropdown1" id="dropdown1-tab" data-toggle="tab">@fat</a>' +
        '<a class="dropdown-item" href="#dropdown2" id="dropdown2-tab" data-toggle="tab">@mdo</a>' +
        '</div>' +
        '</li>' +
        '</ul>'
    var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

    $tabs.find('li:first-child a').trigger('click')
    assert.ok($tabs.find('li:first-child a').hasClass('active'))
    assert.notOk($tabs.find('li:last-child a').hasClass('active'))
    assert.notOk($tabs.find('li:last-child .dropdown-menu a:first-child').hasClass('active'))
  })

  test('nested tabs', (assert) => {
    assert.expect(2)
    var done = assert.async()

    var tabsHTML = '<nav class="nav nav-tabs" role="tablist">' +
        '<a id="tab1" href="#x-tab1" class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="x-tab1">Tab 1</a>' +
        '<a href="#x-tab2" class="nav-item nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab2" aria-selected="true">Tab 2</a>' +
        '<a href="#x-tab3" class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="x-tab3">Tab 3</a>' +
        '</nav>' +
        '<div class="tab-content">' +
        '<div class="tab-pane" id="x-tab1" role="tabpanel">' +
        '<nav class="nav nav-tabs" role="tablist">' +
        '<a href="#nested-tab1" class="nav-item nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab1" aria-selected="true">Nested Tab 1</a>' +
        '<a id="tabNested2" href="#nested-tab2" class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="x-profile">Nested Tab2</a>' +
        '</nav>' +
        '<div class="tab-content">' +
        '<div class="tab-pane active" id="nested-tab1" role="tabpanel">Nested Tab1 Content</div>' +
        '<div class="tab-pane" id="nested-tab2" role="tabpanel">Nested Tab2 Content</div>' +
        '</div>' +
        '</div>' +
        '<div class="tab-pane active" id="x-tab2" role="tabpanel">Tab2 Content</div>' +
        '<div class="tab-pane" id="x-tab3" role="tabpanel">Tab3 Content</div>' +
        '</div>'
    $(tabsHTML).appendTo('#qunit-fixture')

    $('#tabNested2').on('shown.uni.tab', function () {
      assert.ok($('#x-tab1').hasClass('active'))
      done()
    })

    $('#tab1').on('shown.uni.tab', function () {
      assert.ok($('#x-tab1').hasClass('active'))
      $('#tabNested2').trigger($.Event('click'))
    })
      .trigger($.Event('click'))
  })

  test('should not remove fade class if no active pane is present', (assert) => {
    assert.expect(6)
    var done = assert.async()

    var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
        '<li class="nav-item"><a id="tab-home" href="#home" class="nav-link" data-toggle="tab" role="tab">Home</a></li>' +
        '<li class="nav-item"><a id="tab-profile" href="#profile" class="nav-link" data-toggle="tab" role="tab">Profile</a></li>' +
        '</ul>' +
        '<div class="tab-content">' +
        '<div class="tab-pane fade" id="home" role="tabpanel"></div>' +
        '<div class="tab-pane fade" id="profile" role="tabpanel"></div>' +
        '</div>'
    $(tabsHTML).appendTo('#qunit-fixture')

    $('#tab-profile')
      .on('shown.uni.tab', function () {
        assert.ok($('#profile').hasClass('fade'))
        assert.ok($('#profile').hasClass('show'))

        $('#tab-home')
          .on('shown.uni.tab', function () {
            assert.ok($('#profile').hasClass('fade'))
            assert.notOk($('#profile').hasClass('show'))
            assert.ok($('#home').hasClass('fade'))
            assert.ok($('#home').hasClass('show'))

            done()
          })
          .trigger($.Event('click'))
      })
      .trigger($.Event('click'))
  })

  test('should handle removed tabs', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var html = [
      '<ul class="nav nav-tabs" role="tablist">',
      '<li class="nav-item">',
      '<a class="nav-link nav-tab" href="#profile" role="tab" data-toggle="tab">',
      '<button class="close"><span aria-hidden="true">&times;</span></button>',
      '</a>',
      '</li>',
      '<li class="nav-item">',
      '<a id="secondNav" class="nav-link nav-tab" href="#buzz" role="tab" data-toggle="tab">',
      '<button class="close"><span aria-hidden="true">&times;</span></button>',
      '</a>',
      '</li>',
      '<li class="nav-item">',
      '<a class="nav-link nav-tab" href="#references" role="tab" data-toggle="tab">',
      '<button id="btnClose" class="close"><span aria-hidden="true">&times;</span></button>',
      '</a>',
      '</li>',
      '</ul>',
      '<div class="tab-content">',
      '<div role="tabpanel" class="tab-pane fade show active" id="profile">test 1</div>',
      '<div role="tabpanel" class="tab-pane fade" id="buzz">test 2</div>',
      '<div role="tabpanel" class="tab-pane fade" id="references">test 3</div>',
      '</div>'
    ].join('')

    $(html).appendTo('#qunit-fixture')

    $('#secondNav').on('shown.uni.tab', function () {
      assert.strictEqual($('.nav-tab').length, 2)
      done()
    })

    $('#btnClose').one('click', function () {
      var tabId = $(this).parents('a').attr('href')
      $(this).parents('li').remove()
      $(tabId).remove()
      $('.nav-tabs a:last').unikornTab('show')
    })
      .trigger($.Event('click'))
  })

  test('should not add show class to tab panes if there is no `.fade` class', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var html = [
      '<ul class="nav nav-tabs" role="tablist">',
      '<li class="nav-item">',
      '<a class="nav-link nav-tab" href="#home" role="tab" data-toggle="tab">Home</a>',
      '</li>',
      '<li class="nav-item">',
      '<a id="secondNav" class="nav-link nav-tab" href="#profile" role="tab" data-toggle="tab">Profile</a>',
      '</li>',
      '</ul>',
      '<div class="tab-content">',
      '<div role="tabpanel" class="tab-pane" id="home">test 1</div>',
      '<div role="tabpanel" class="tab-pane" id="profile">test 2</div>',
      '</div>'
    ].join('')

    $(html).appendTo('#qunit-fixture')

    $('#secondNav').on('shown.uni.tab', function () {
      assert.strictEqual($('.show').length, 0)
      done()
    })
      .trigger($.Event('click'))
  })

  test('should add show class to tab panes if there is a `.fade` class', (assert) => {
    assert.expect(1)
    var done = assert.async()

    var html = [
      '<ul class="nav nav-tabs" role="tablist">',
      '<li class="nav-item">',
      '<a class="nav-link nav-tab" href="#home" role="tab" data-toggle="tab">Home</a>',
      '</li>',
      '<li class="nav-item">',
      '<a id="secondNav" class="nav-link nav-tab" href="#profile" role="tab" data-toggle="tab">Profile</a>',
      '</li>',
      '</ul>',
      '<div class="tab-content">',
      '<div role="tabpanel" class="tab-pane fade" id="home">test 1</div>',
      '<div role="tabpanel" class="tab-pane fade" id="profile">test 2</div>',
      '</div>'
    ].join('')

    $(html).appendTo('#qunit-fixture')

    $('#secondNav').on('shown.uni.tab', function () {
      assert.strictEqual($('.show').length, 1)
      done()
    })
      .trigger($.Event('click'))
  })
})
