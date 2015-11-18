var routerOptions = {
  onBeforeAction: Router.requireLogin,
  onRun: function () {
    var collection = Collections.findOne(this.params._id);
    if (!collection) {
      return this.render('notFound');
    }

    Session.set(CURRENT_COLLECTION_KEY, collection);
    this.next();
  }
};

var CollectionController = RouteController.extend(routerOptions);
var NavigationCollectionController = NavigationController.extend(routerOptions);

 ------------------------------------------------------------------

Router.route('/collections/:_id', {
  name: 'collection',
  template: 'fragmentsList',
  controller: CollectionController
});

/* ------------------------------------------------------------------ */

Router.route('/collections/:_id/settings', {
  name: 'collectionSettings',
  controller: NavigationCollectionController,
  onRun: function () {
    Session.set(HIDE_SEARCH_BAR, true);
    this.next();
  },
  onStop: function () {
    Session.set(HIDE_SEARCH_BAR, false);
  }
});