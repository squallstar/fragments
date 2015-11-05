FragmentsListController = RouteController.extend({
  template: 'fragmentsList',
  onBeforeAction: Router.requireLogin
});

Router.route('/', {
  name: 'home',
  controller: FragmentsListController
});