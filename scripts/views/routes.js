'use strict';

page('/', app.userView.initIndexPage);
page('/signin', app.userView.initSigninView);
page('/signup', app.userView.initSignupView);
page('/user/:username/feed',
  (ctx, next) => app.User.fetchInterests(ctx, next),
  (ctx, next) => app.userView.initFeedView(ctx, next),
  // (ctx, next) => app.Video.findByInterests(ctx, next),
  // (ctx, next) => app.userView.initVideoList(ctx, next)
  (ctx, next) => app.Video.findDmByInterests(ctx, next),
  (ctx, next) => app.userView.initDmVideoList(ctx, next)
);

page();
