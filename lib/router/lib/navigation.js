NavigationController = RouteController.extend({
  onRun: function () {
    Session.set(HAS_BACK_ARROW_KEY, true);
    this.next();
  },
  onStop: function () {
    Session.set(HAS_BACK_ARROW_KEY, false);
  }
});