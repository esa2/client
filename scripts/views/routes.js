'use strict';

page('/', );
page('/user/authenticate'
  , app.User.authenticate
  , result => app.userView.InitIndexPage(result)
);

page();
