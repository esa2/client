'use strict';

var app = app || {};

(function(module) {
  const userView = {};

  function resetView() {
    $('.content').hide();
  }

  // Show the Video Feed
  userView.initFeedView = (ctx, next) => {
    resetView();
    $('.logout-section').show();
    $('.logout-btn').one('click', function(event){
      event.preventDefault();
      // Remove logged in user for localstorage
      module.User.logout()
      page('/');
    });
    next();
  };

  // Show video list
  userView.initVideoList = () => {
    // If no videos were found, the user needs to add more interests
    if (app.Video.all.length === 0) {
      console.log('No Interests! Add them now!');
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
    $('.signin-section').show();

    // Clear out the current signin fields
    $('.signin-form input[name="username"]').val('');
    $('.signin-form input[name="password"]').val('');

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

    // Show the signup form
    $('.signup-section').show();

    // Clear out the current signup fields
    $('.signup-form input[name="username"]').val('');
    $('.signup-form input[name="password"]').val('');

    // Show the signup form
    $('.signup-section').show();
    $('.logout-btn').hide();
    $('.signin-btn').hide();
    // $('.search-btn').hide(); COMMENTED OUT IN INDEX.HTML


    // Set a signup event handler on the signup button once
    $('.signup-form').one('submit', function(e) {
      e.preventDefault();
      let realname = e.target.realname.value;
      let username = e.target.username.value;
      let password = e.target.password.value;
      module.User.fetch(username, {
        'realname': realname,
        'password': password
      }, module.User.create);
    });
  };

  userView.initIndexPage = () => {
    // If a user is logged in already immediately navigate to /feed
    if (localStorage.uvueUser) {
      console.log(`Found a logged in user ${localStorage.uvueUser}`)
      // If their was a user logged in previously, try to fetch the user
      module.User.fetch(JSON.parse(localStorage.uvueUser), null,
        () => page(`/user/${JSON.parse(localStorage.uvueUser)}/feed`));
    } else {
      page('/signin');
    }
  };

  $(document).ready(function(){
    $('.toggle').on('click', function(){
      $('nav ul').toggleClass('show');
    });
  });

  module.userView = userView;
})(app);