Router.route('search', {
  name: 'search',
  template: 'searchView',
  controller: NavigationController,
  onBeforeAction: Router.requireLogin,
  waitOn: function() {
    return Meteor.subscribe('searchHistory');
  },
  data: function() {
    return {
      searchHistory: SearchHistory.find()
    }
  }
});