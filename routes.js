'use strict';

page('/', () => app.Book.fetchAll(app.bookView.initIndexView))


page('/user/authenticate',
    // (ctx, next) => app.User.authenticate(ctx, app.userView.initIndexPage));  
    (ctx, next) => console.log(ctx, 'good shit!'));
    page ();

