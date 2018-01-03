'use strict';

var app = app || {};

(function(module) {

  const userView = {}

  userView.initIndexPage = function(ctx, next) {
    $('.container').hide();
    $('#home-login').show();

    console.log(userView, 'working');
    // next()
  }
  userView.initIndexPage();

  module.userView = userView;
})(app);
