FragmentsListController = RouteController.extend({
  template: 'fragmentsList',
});

Router.route('/', {
  name: 'home',
  controller: FragmentsListController
});

Router.onBeforeAction(Router.requireLogin, { only: 'home' });