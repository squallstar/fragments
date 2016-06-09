var LoggedOutController = RouteController.extend({
  onBeforeAction: Router.requireLoggedOut
});

/* ------------------------------------------------------------------ */

Router.route('/login', {
  name: 'login',
  template: 'login',
  controller: LoggedOutController,
  seo: {
    title: 'Login'
  }
});

/* ------------------------------------------------------------------ */

Router.route('/sign-up', {
  name: 'register',
  template: 'register',
  controller: LoggedOutController,
  seo: {
    title: 'Sign up'
  }
});

/* ------------------------------------------------------------------ */

Router.route('/reset-password/:token?', {
  name: 'reset_password',
  template: 'reset_password',
  controller: LoggedOutController,
  data: function() { return { token: this.params.token } },
  seo: {
    title: 'Reset password'
  }
});

/* ------------------------------------------------------------------ */

Router.route('/verify-email/:token?', {
  name: 'verify_email',
  action: function () {
    Accounts.verifyEmail(this.params.token, function (err) {
      if (err) {
        return UINotification.error(err.reason);
      }

      UINotification.success('Your email address has been verified');
      Router.go('home');
    });
  },
  seo: {
    title: 'Verify email'
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