

/* ------------------------------------------------------------------ */

LoginController = RouteController.extend({
  template: 'login',
});

Router.route('/login', {
  name: 'login',
  controller: LoginController,
  onBeforeAction: Router.requireLoggedOut
});

/* ------------------------------------------------------------------ */

RegisterController = RouteController.extend({
  template: 'register',
});

Router.route('/sign-up', {
  name: 'register',
  controller: RegisterController,
  onBeforeAction: Router.requireLoggedOut
});

/* ------------------------------------------------------------------ */

ResetPasswordController = RouteController.extend({
  template: 'reset_password',
});

Router.route('/reset-password/:token?', {
  name: 'reset_password',
  controller: ResetPasswordController,
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