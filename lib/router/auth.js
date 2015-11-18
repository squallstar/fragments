Router.route('/login', {
  name: 'login',
  template: 'login',
  onBeforeAction: Router.requireLoggedOut
});

/* ------------------------------------------------------------------ */

Router.route('/sign-up', {
  name: 'register',
  template: 'register',
  onBeforeAction: Router.requireLoggedOut
});

/* ------------------------------------------------------------------ */

Router.route('/reset-password/:token?', {
  name: 'reset_password',
  template: 'reset_password',
  onBeforeAction: Router.requireLoggedOut,
  data: function() { return { token: this.params.token } }
});

/* ------------------------------------------------------------------ */

Router.route('/logout', function () {
  this.render('loading');

  if (Meteor.userId()) {
    Meteor.logout();
  }

  Router.go('login');
});