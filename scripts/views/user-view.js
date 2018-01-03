'use strict';

var app = app || {};

(function(module) {
  const userView = {};

  function resetView() {
    $('.content').hide();
  }

  // Show the Video Feed
  userView.initFeedView = () => {
    resetView();
    $('.logout-button').show();
    $('.search-view').show();
    $('.search-form').on('submit', function(event) {
      event.preventDefault();
      module.Video.search(userView.initsearchResultsPage);
    });
  };

  // Show the Signin view
  userView.initSigninView = () => {
    resetView();

    // Clear out the current signin fields
    $('.signin-form input[name="username"]').val('');
    $('.signin-form input[name="password"]').val('');

    // Show the signin form
    $('.signin-section').show();

    // Set a signin event handler on the signin button once
    $('.signin-form').one('submit', function(e) {
      e.preventDefault();
      let username = e.target.username.value;
      let password = e.target.password.value;
      module.User.fetch(username, password, module.User.validate);
    });
  };

  userView.initSignupView = () => {
    resetView();

    // Clear out the current signup fields
    $('.signup-form input[name="username"]').val('');
    $('.signup-form input[name="password"]').val('');

    // Show the signup form
    $('.signup-section').show();

    // Set a signup event handler on the signup button once
    $('.signup-form').one('submit', function(e) {
      e.preventDefault();
      let realname = e.target.realname.value;
      let username = e.target.username.value;
      let password = e.target.password.value;
      module.User.fetch(username, {'realname': realname, 'password': password}, module.User.create);
    });
  };

  userView.initIndexPage = () => {
    // If a user is logged in already immediately navigate to /feed
    if (localStorage.uvueUser) {
      page(`/user/${JSON.parse(localStorage.uvueUser)}/feed`);
    } else {
      page('/signin');
    }
  };

  module.userView = userView;
})(app);
