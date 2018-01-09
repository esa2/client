'use strict'

page.base('/client')

page('/', app.userView.initIndexPage)
page('/signin', app.userView.initSigninView)
page('/signup', app.userView.initSignupView)
// page('/about', app.userView.initAboutPage)
page('/user/:username/feed',
  (ctx, next) => app.User.fetchInterests(ctx, next),
  (ctx, next) => app.userView.initFeedView(ctx, next),
  //(ctx, next) => app.Video.findYtByInterests(ctx, next),
  (ctx, next) => app.Video.findDmByInterests(ctx, next),
  (ctx, next) => app.userView.initVideoList(ctx, next)
)

page()
