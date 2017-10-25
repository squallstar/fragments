Router.route('/fragments', {
  name: 'home',
  template: 'fragmentsList',
  onBeforeAction: Router.requireLogin,
  onRun: function () {
    [CURRENT_COLLECTION_KEY, CURRENT_SEARCH_KEY].forEach(function (key) {
      Session.set(key, undefined);
    });

    var collaborationToken = Session.get(COLLABORATE_TOKEN);

    Session.set(FAVOURITES_ONLY, this.params.query.favourites);

    if (collaborationToken) {
      Meteor.call('joinCollaborateCollection', collaborationToken, function (err, collection) {
        Session.set(COLLABORATE_TOKEN, null);
        Session.set(SIDEBAR_OPEN_KEY, true);
      });
    }

    this.next();
  }
});

/* ------------------------------------------------------------------ */

Router.route('/add-fragment-popup', {
  template: 'addFragmentPopup',
  layoutTemplate: 'emptyLayout',
  onBeforeAction: Router.requireLogin,
  data: function () {
    return this.params.query.url;
  }
});