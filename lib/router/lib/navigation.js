NavigationController = RouteController.extend({
  onRun: function () {
    Session.set(HAS_BACK_ARROW, true);
    this.next();
  },
  onStop: function () {
    Session.set(HAS_BACK_ARROW, false);
  }
});