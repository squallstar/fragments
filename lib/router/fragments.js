FragmentsListController = RouteController.extend({
  template: 'fragmentsList',
});

Router.route('/', {
  name: 'home',
  controller: FragmentsListController
});

/* ------------------------------------------------------------------ */

LoginController = RouteController.extend({
  template: 'login',
});

Router.route('/login', {
  name: 'login',
  controller: LoginController
});

/* ------------------------------------------------------------------ */

RegisterController = RouteController.extend({
  template: 'register',
});

Router.route('/sign-up', {
  name: 'register',
  controller: RegisterController
});

/* ------------------------------------------------------------------ */

ResetPasswordController = RouteController.extend({
  template: 'reset_password',
});

Router.route('/reset-password/:token?', {
  name: 'reset_password',
  controller: ResetPasswordController
});