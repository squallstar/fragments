Router.route('/fragments', {
  name: 'home',
  template: 'fragmentsList',
  onBeforeAction: Router.requireLogin,
  onRun: function () {
    [CURRENT_COLLECTION_KEY, CURRENT_SEARCH_KEY].forEach(function (key) {
      Session.set(key, undefined);
    });

    var collaborationToken = Session.get(COLLABORATE_TOKEN);

    if (collaborationToken) {
      Meteor.call('joinCollaborateCollection', collaborationToken, function (err, collection) {
        Session.set(COLLABORATE_TOKEN, null);
        Router.go('collection', collection);
      });
    }

    this.next();
  }
});