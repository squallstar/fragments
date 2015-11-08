FragmentsListController = RouteController.extend({
  template: 'fragmentsList',
  onBeforeAction: Router.requireLogin
});

Router.route('/', {
  name: 'home',
  controller: FragmentsListController
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
  }
});