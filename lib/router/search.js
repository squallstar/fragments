Router.route('/search', {
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
  },
  seo: {
    title: 'Search'
  }
});

/* ------------------------------------------------------------------ */

Router.route('/search/:text', {
  name: 'searchResults',
  template: 'fragmentsList',
  onBeforeAction: Router.requireLogin,
  onRun: function () {
    Session.set(CURRENT_SEARCH_KEY, this.params.text);
    Meteor.call('addSearchHistory', this.params.text);
    this.next();
  },
  data: function () {
    return {
      textQuery: new ReactiveVar(this.params.text)
    };
  },
  seo: {
    title: function () {
      return this.data().textQuery;
    }
  }
});