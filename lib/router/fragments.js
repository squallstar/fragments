FragmentsListController = RouteController.extend({
  template: 'fragmentsList',
  onBeforeAction: Router.requireLogin
});

Router.goToRelevant = function () {
  if (Session.get(CURRENT_COLLECTION_KEY)) {
    Router.go('collection', Session.get(CURRENT_COLLECTION_KEY));
  } else {
    Router.go('home');
  }
}

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

Router.route('/search/:text', {
  name: 'searchResults',
  controller: FragmentsListController,
  onBeforeAction: function () {
    Session.set(CURRENT_SEARCH_KEY, this.params.text);
    this.next();
  },
  onAfterAction: function () {
    Meteor.call('addSearchHistory', this.params.text);
  },
  data: function () {
    return {
      textQuery: new ReactiveVar(this.params.text)
    };
  }
});

Router.route('/collections/:_id', {
  name: 'collection',
  controller: FragmentsListController,
  onBeforeAction: function () {
    var collection = Collections.findOne(this.params._id);
    if (!collection) {
      return this.render('notFound');
    }

    Session.set(CURRENT_COLLECTION_KEY, collection);
    this.next();
  }
});