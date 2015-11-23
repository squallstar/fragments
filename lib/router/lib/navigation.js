// Controller with back arrow
NavigationController = RouteController.extend({
  onRun: function () {
    Session.set(HAS_BACK_ARROW_KEY, true);
    this.next();
  },
  onStop: function () {
    Session.set(HAS_BACK_ARROW_KEY, false);
  }
});

// Controller with back arrow and no search bar
NavigationPageController = RouteController.extend({
  onRun: function () {
    Session.set(CURRENT_COLLECTION_KEY, undefined);
    Session.set(HIDE_SEARCH_BAR, true);
    Session.set(HAS_BACK_ARROW_KEY, true);
    this.next();
  },
  onStop: function () {
    Session.set(HIDE_SEARCH_BAR, false);
    Session.set(HAS_BACK_ARROW_KEY, false);
  }
});