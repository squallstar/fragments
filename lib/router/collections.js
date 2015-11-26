
var CollectionController = RouteController.extend({
  fastRoute: true,
  waitOn: function () {
    return Meteor.subscribe('collection', this.params._id);
  },
  data: function () {
    return {
      collection: this.collection
    };
  },
  onBeforeAction: function () {
    var collection = Collections.findOne(this.params._id);

    if (!collection) {
      return this.render('notFound');
    }

    if (this.route.getName() !== 'collection') {
      // Check if user is owner before displaying routes that are not the overview
      if (collection.user !== Meteor.userId()) {
        return this.render('notFound');
      }
    }

    Session.set(CURRENT_COLLECTION_KEY, collection);

    this.collection = collection;
    this.next();
  }
});

/* ------------------------------------------------------------------ */

Router.route('/collections/:_id', {
  name: 'collection',
  template: 'fragmentsList',
  controller: CollectionController
});

/* ------------------------------------------------------------------ */

Router.route('/collections/:_id/settings', {
  name: 'collectionSettings',
  controller: CollectionController,
  onRun: function () {
    Session.set(HIDE_SEARCH_BAR, true);
    Session.set(HAS_BACK_ARROW_KEY, true);
    this.next();
  },
  onStop: function () {
    Session.set(HIDE_SEARCH_BAR, false);
    Session.set(HAS_BACK_ARROW_KEY, false);
  }
});