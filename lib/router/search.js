Router.route('search', {
  name: 'search',
  template: 'searchView',
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