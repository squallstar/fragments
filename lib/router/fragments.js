Router.route('/fragments', {
  name: 'home',
  template: 'fragmentsList',
  onBeforeAction: Router.requireLogin,
  onRun: function () {
    [CURRENT_COLLECTION_KEY, CURRENT_SEARCH_KEY].forEach(function (key) {
      Session.set(key, undefined);
    });
    this.next();
  }
});