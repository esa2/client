'use strict';

page('/', app.userView.initIndexPage);
page('/signin', app.userView.initSigninView);
page('/signup', app.userView.initSignupView);
page('/user/:username/feed', app.userView.initFeedView);

page();
