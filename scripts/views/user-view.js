'use strict';

var app = app || {};

(function(module) {
  bookView.initNewBook = function() {
    resetView();
    $('.container').hide()
    $('#form-view').show()
    $('#new-book-form').on('change', 'input, textarea', bookView.create);
    $('#new-book-form').on('submit', bookView.submit);
  }
  module.userView = userView;
})(app);
