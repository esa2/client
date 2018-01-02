'use strict';

page('/', );
page('/user/authenticate', (ctx, next) =>
  app.User.authenticate(ctx, app.userView.initIndexPage),
);

page();
