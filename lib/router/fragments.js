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
  onRun: function () {
    [CURRENT_COLLECTION_KEY, CURRENT_SEARCH_KEY].forEach(function (key) {
      Session.set(key, undefined);
    });
    this.next();
  }
});

Router.route('/search/:text', {
  name: 'searchResults',
  controller: FragmentsListController,
  onRun: function () {
    Session.set(CURRENT_SEARCH_KEY, this.params.text);
    Meteor.call('addSearchHistory', this.params.text);
    this.next();
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
  onRun: function () {
    var collection = Collections.findOne(this.params._id);
    if (!collection) {
      return this.render('notFound');
    }

    Session.set(CURRENT_COLLECTION_KEY, collection);
    this.next();
  }
});