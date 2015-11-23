Router.route('/account', {
  name: 'account',
  onRun: Router.requireLogin
});