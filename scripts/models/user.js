'use strict';

var app = app || {};

(function(module) {
  // var __API_URL__ = 'https://uvue.herokuapp.com';
  var __API_URL__ = 'http://localhost:3000';
  // All videos per user interest
  User.videos = [];
  User.user = null;

  function errorCallback(err) {
    console.error(err);
    module.errorView.initErrorPage(err);
  }

  function User(rawUserObj) {
    Object.keys(rawUserObj).map(key => (this[key] = rawUserObj[key]));
  }

  // Load a user
  User.loadIt = dbRow => {
    // nothing to load
    if (!dbRow.length) return;

    console.log('dbRow:', dbRow);
    // Only one user should ever be returned
    User.user = new User(dbRow[0]);
  };

  // Fetch user from database - run optional callback with arg
  User.fetch = (username, arg, callback) => {
    User.user = null;
    $.get(`${__API_URL__}/api/v1/users/${username}`)
      .then(User.loadIt)
      .then(() => callback(username, arg))
      .catch(errorCallback);
  };

  // Validate the password
  User.validate = (username, password) => {
    // It was an invalid username
    if (User.user === null) {
      console.log('Invalid Username!');
    } else if (User.user.password !== password) {
      console.log(`Invalid Password for ${User.user.username}!`);
    } else {
      console.log('Successfully logged in!');
      // Store username in localStorage for persistence of login
      localStorage.uvueUser = JSON.stringify(User.user.username);
      page(`/user/${User.user.username}/feed`);
    }
  };

  // First verify, then create
  User.create = (username, arg) => {
    if (User.user !== null) {
      console.log('Error, this user already exists!');
      return;
    }
    arg.username = username;
    // Create a new user in the database
    $.post(`${__API_URL__}/api/v1/users`, arg)
      .then(() => {
        localStorage.uvueUser = JSON.stringify(username);
        User.fetch(username, null, () => page(`/user/${username}/feed`));
      })
      .catch(errorCallback);
  }

  module.User = User;
})(app);
