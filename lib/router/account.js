Router.route('/account', {
  name: 'account',
  onBeforeRun: Router.requireLogin,
  controller: NavigationPageController
});