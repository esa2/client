'use strict';

var app = app || {};

(function(module) {
  const userView = {};

  function resetView() {
    $('.content').hide();
  }

  userView.initAddInterestSection = () => {
    // First, empty the tag editor
    $('.tag-editor').empty();
    // Populate interest tag editor with current interests
    app.User.interests.map(ele => {
      let template = Handlebars.compile($('.interest-tag-template').text());
      $('.tag-editor').append(template({'value': ele}));
    })

    // Event handler for adding a tag
    $('.interest-add-btn').on('click', function (e) {
      e.preventDefault();
      let value = $('#interest-input').val();
      let template = Handlebars.compile($('.interest-tag-template').text());

      // either a duplicate or empty string - disallowed
      if (app.User.interests.indexOf(value) !== -1 || value === '') {
        return;
      }

      // empty out the input box
      $('#interest-input').val('');
      // Append a new tag to the tag editor box
      $('.tag-editor').append(template({'value': value}));
      // Add the tag to the interests array
      app.User.interests.push(value);
      // Add interest to the db
      app.User.addInterest(value);
    });

    // Event handler for removing a tag
    $('.add-interest-section').on('click', '.cross', function(e) {
      e.preventDefault();
      let interest = $(this).parent('a').attr('data-interest');
      // Extract the index of the tag to remove
      let idx = app.User.interests.indexOf(interest);
      // do it
      app.User.interests.splice(idx, 1);
      $(this).parent('a').remove();
      // Remove interest from the db
      app.User.removeInterest(interest);
    });
  }

  // Show the Video Feed
  userView.initFeedView = (ctx, next) => {
    resetView();

    // animation hide/show start/stop
    $(document).ajaxStart(function(){
      $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
      $(".giphy-embed").css("display", "none");
      $(".hide-anim").hide();
    });
    // animation hide/show start/stop


    $('.nav-button').show();
    $('.logout-btn').show();
    $('.logout-btn').on('click', function(event){
      event.preventDefault();
      // Remove logged in user for localstorage
      module.User.logout()
      page('/client');
    });

    // Prep the interest section
    $('.add-interest-section').show();
    userView.initAddInterestSection();
    next();
  };

  // Show video list
  userView.initVideoList = () => {
    $('.video-list').empty();
    // If no videos were found, the user needs to add more interests
    if (app.Video.all.length === 0) {
      $('.no-interest-msg').show();
      return;
    }

    // Append all videos to the view
    $('.video-view').show()
    app.Video.all.forEach(video => {
      let template;
      if (video.source === 'youtube') {
        template = Handlebars.compile($('.video-list-template').text());
      } else {
        template = Handlebars.compile($('.video-dmlist-template').text());
      }
      $('.video-list').append(template(video));
    })
  };

  // Show the Signin view
  userView.initSigninView = () => {
    resetView();
    // animation hide/show start/stop
    $(document).ajaxStart(function(){
      $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
      $(".hide-anim").hide();
    });

    // animation hide/show start/stop
    $('.hide-anim').hide();
    $('.logout-btn').hide();
    $('.nav-button').show();

    $('.signin-section').show();
    // Clear out the current signin fields
    $('.signin-form input[name="username"]').val('');
    $('.signin-form input[name="password"]').val('');

    // Set a signin event handler on the signin button once
    $('.signin-form').on('submit', function(e) {
      e.preventDefault();
      let username = e.target.username.value;
      let password = e.target.password.value;
      module.User.fetch(username, password, module.User.validate);
    });
  };

  userView.initSignupView = () => {
    resetView();

    // Show the signup section
    $('.signup-section').show();

    // Clear out the current signup fields
    $('.signup-form input[name="username"]').val('');
    $('.signup-form input[name="password"]').val('');

    // Set a signup event handler on the signup button once
    $('.signup-form').on('submit', function(e) {
      e.preventDefault();
      let realname = e.target.realname.value;
      let username = e.target.username.value;
      let password = e.target.password.value;
      module.User.create(username, {
        'realname': realname,
        'password': password,
      })
    });
  };

  userView.initIndexPage = () => {
    // If a user is logged in already immediately navigate to /feed
    if (localStorage.uvueUser) {
      console.log(`Found a logged in user ${localStorage.uvueUser}`)
      // If their was a user logged in previously, try to fetch the user
      module.User.fetch(JSON.parse(localStorage.uvueUser), null,
        () => page(`/client/user/${JSON.parse(localStorage.uvueUser)}/feed`));
    } else {
      page('/client/signin');
    }
  };

  userView.initAboutPage = function () {
    resetView();
    $('.about_us-section').show();
    $('.nav-button').show();
  };

  $(document).ready(function(){
    $('.toggle').on('click', function(){
      $('nav ul').toggleClass('show');
    });
  });

  module.userView = userView;
})(app);
