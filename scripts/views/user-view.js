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

  module.userView = userView;
})(app);

