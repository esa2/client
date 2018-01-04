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
    $('.logout-div').show();
    // $('.search-view').show(); COMMENTED OUT IN INDEX.HTML
    $('.logout-btn').one('click', function(event){
      event.preventDefault();
      // Remove logged in user for localstorage
      module.User.logout()
      page('/');
    });
    next();
    // $('.search-form').on('submit', function(event) {
    //   event.preventDefault();
    //   let searchValue = $('.search-form input[name="search"]').val();
    //   let searchValueObj = {
    //     search: searchValue
    //   }
    //   console.log('search for ')
    //   console.log(searchValueObj)
    //   module.Video.search(searchValueObj);
    // });
  };

  // Show video list
  userView.initVideoList = (ctx, next) => {
    // If no videos were found, the user needs to add more interests
    if (app.Video.all.length === 0) {
      console.log('No Interests! Add them now!');
      return;
    }

    console.log('Adding videos now!');

    $('.video-view').show()

    // Append all videos to the view
    app.Video.all.forEach(video =>{
      let template = Handlebars.compile($('.video-list-template').text());
      $('.video-list').append(template(video));
    })
  }
  // adding dm content
  userView.initDmVideoList = (ctx, next) => {
    // If no videos were found, the user needs to add more interests
    // if (app.Video.all.length === 0) {
    //   console.log('No Interests! Add them now!');
    //   return;
    // }

    console.log('Adding DM videos now!');

    $('.video-dmview').show()

    // Append all videos to the view
    app.Video.allDm.forEach(video =>{
      let template = Handlebars.compile($('.video-dmlist-template').text());
      $('.video-dmlist').append(template(video));
    })
  }
  //dm content above

  // Show the Signin view
  userView.initSigninView = () => {
    resetView();

    // Clear out the current signin fields
    $('.signin-form input[name="username"]').val('');
    $('.signin-form input[name="password"]').val('');

    // Show the signin form
    $('.signin-section').show();
    $('.logout-btn').hide();
    // $('.search-btn').hide(); COMMENTED OUT IN INDEX.HTML


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
    $('.signin-btn').hide();
    $('.signup-btn').hide();
    $('.signin-form').hide();

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

  module.userView = userView;
})(app);
