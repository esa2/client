'use strict';

var app = app || {};

(function(module) {
  // var __API_URL__ = 'https://uvue.herokuapp.com';
  var __API_URL__ = 'http://localhost:3000';

  // All videos per user interest
  User.videos = [];

  function errorCallback(err) {
    console.error(err);
    module.errorView.initErrorPage(err);
  }

  function User(rawUserObj) {
    Object.keys(rawUserObj).map(key => this[key] = rawUserObj[key]);
  }

  User.authenticate = (ctx, callback) => {
    $.get(`${__API_URL__}/api/v1/users/:username`)
      .then(console.log)
      .catch(errorCallback);
  }

  module.User = User;
})(app);
