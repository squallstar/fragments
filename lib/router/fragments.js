FragmentsListController = RouteController.extend({
  template: 'fragmentsList',
  onBeforeAction: Router.requireLogin
});

Router.route('/', {
  name: 'home',
  controller: FragmentsListController,
  onBeforeAction: function () {
    [CURRENT_COLLECTION_KEY, CURRENT_SEARCH_KEY].forEach(function (key) {
      Session.set(key, undefined);
    });
    this.next();
  }
});

Router.route('/search/:query', {
  name: 'searchResults',
  controller: FragmentsListController,
  onBeforeAction: function () {
    Session.set(CURRENT_SEARCH_KEY, this.params.query);
    this.next();
  },
  onAfterAction: function () {
    Meteor.call('addSearchHistory', this.params.query);
  },
  data: function () {
    return {
      textQuery: new ReactiveVar(this.params.query)
    };
  }
});

Router.route('/collections/:_id', {
  name: 'collection',
  controller: FragmentsListController,
  data: function () {
    return this.collection;
  },
  onBeforeAction: function () {
    this.collection = Collections.findOne(this.params._id);
    Session.set(CURRENT_COLLECTION_KEY, this.collection);
    this.next();
  }
});