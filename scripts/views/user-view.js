'use strict';
var app = app || {};

(function(module) {

  function resetView() {
    $('.content').hide();
    if (localStorage.uvueUser) {
      $('.interest-form').show();
      $('.logout-button').show();
      $('.search-view').show();
    } else {
      $('.user-form input[name="user-name"]').val('');
      $('.user-form input[name="user-password"]').val('');
      $('.user-form').show();
    }
  }
  resetView();

  $('.user-form').on('submit', function(event) {
    event.preventDefault();
    localStorage.uvueUser = $('.user-form input[name="user-name"]').val();
    resetView();
  });

  $('.logout-button').on('click', 'button', function() {
    localStorage.clear();
    resetView();
  });

  resetView();
  $('.search-view').show();
  $('.search-form').on('submit', function(event) {
    event.preventDefault();

    let searchValue = $('.search-form input[name="search"]').val();
    let searchValueObj = {
      search: searchValue
    }
    console.log('search for ' + searchValueObj)
    module.Video.search(searchValueObj);

  })

})(app);
