//
// Scripts
// =============================================================================
/* eslint-disable semi */

//- if (typeof $ === 'undefined') {
//-   throw new ReferenceError("UniKorn's JavaScript requires jQuery. jQuery must be included before UniKorn's JavaScript.");
//- }

//- // jQuery is loaded => print the version
//- // $().jquery, $.fn.jquery, jquery().jquery, jquery.fn.jquery
//- console.log('You are running jQuery version: ' + $.fn.jquery);

$(function() {
  // Window Scroll
  $(window).on('scroll', function() {
    var navbar = $('.navbar'),
        totop = $('.back-to-top'),
        windowPos = $(window).scrollTop(),
        scrollPos = windowPos ? windowPos : 0;

    if (scrollPos > 500) {
      navbar.removeClass('navbar-light bg-transparent').addClass('navbar-dark bg-dark');
      totop.filter(':hidden').stop(true, true).fadeIn();
    } else {
      navbar.removeClass('navbar-dark bg-dark').addClass('navbar-light bg-transparent');
      totop.stop(true, true).fadeOut();
    }

    try {
      var scrollProcent = 0;
      scrollProcent = 100 - Math.round(
        (($(document).height() - $(window).height() - $(window).scrollTop()) * 100) /
        ($(document).height() - $(window).height())
      );
      $('.back-to-top-bg-change').height(scrollProcent + '%');
    } catch (e) {
      console.log(e);
    }
  });

  // Toggle Search Form
  $('a[href="#toggle-search"], .uni-search .input-group-btn > .btn[type="reset"]').on('click', function(e) {
    e.preventDefault(),
    $('.uni-search .input-group > input').val(''),
    $('.uni-search').toggleClass('open'),
    $('a[href="#toggle-search"]').toggleClass('active'),
    $('.uni-search').hasClass('open') && setTimeout(function() {
      $('.uni-search .form-control').trigger('focus')
    }, 100);
  });

  // Scroll to Features section
  $('.scroll-down').on('click', function() {
    $('html, body').animate({
      scrollTop: $('#uni-features').offset().top
    }, 1000);
  });

  // Scroll to Top
  $('.back-to-top-icon').on('click', function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1000);
    return false;
  });
});
