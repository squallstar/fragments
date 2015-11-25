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

Router.route('/verify-email/:token?', {
  name: 'verify_email',
  action: function () {
    Accounts.verifyEmail(this.params.token, function (err) {
      if (err) {
        return Notifications.error(err.reason);
      }

      Notifications.success('Your email address has been verified');
      Router.go('home');
    });
  }
});

/* ------------------------------------------------------------------ */

Router.route('/logout', function () {
  this.render('loading');

  if (Meteor.userId()) {
    Meteor.logout();
  }

  Router.go('login');
});