var LoggedOutController = RouteController.extend({
  onBeforeAction: Router.requireLoggedOut
});

/* ------------------------------------------------------------------ */

Router.route('/login', {
  name: 'login',
  template: 'login',
  controller: LoggedOutController
});

/* ------------------------------------------------------------------ */

Router.route('/sign-up', {
  name: 'register',
  template: 'register',
  controller: LoggedOutController
});

/* ------------------------------------------------------------------ */

Router.route('/reset-password/:token?', {
  name: 'reset_password',
  template: 'reset_password',
  controller: LoggedOutController,
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