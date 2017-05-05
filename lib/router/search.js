Router.route('/search', {
  name: 'search',
  template: 'searchView',
  controller: NavigationController,
  onBeforeAction: Router.requireLogin,
  waitOn: function() {
    Session.set(CURRENT_LIMIT_KEY, 0);
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
    if (!this.params.text.match(/^fragment:([0-9A-z]+)$/)) {
      Meteor.call('addSearchHistory', this.params.text);
    }
    this.next();
  },
  data: function () {
    return {
      textQuery: new ReactiveVar(this.params.text),
      revealFragmentComments: this.params.query.c
    };
  },
  seo: {
    title: function () {
      return this.data().textQuery.get();
    }
  }
});