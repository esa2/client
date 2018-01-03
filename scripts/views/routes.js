'use strict';

page('/', app.userView.initIndexPage);
page('/signin', app.userView.initSigninView);
page('/signup', app.userView.initSignupView);
page('/user/:username/feed',
  (ctx, next) => app.User.fetchInterests(ctx, next),
  app.userView.initFeedView);
// page('/user/:username/feed', app.userView.initFeedView);

page();
