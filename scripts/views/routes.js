'use strict';

page('/', app.resetView);
page('/user/authenticate'
  , app.User.authenticate
);

page();
