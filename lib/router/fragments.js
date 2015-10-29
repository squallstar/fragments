FragmentsListController = RouteController.extend({
  template: 'fragmentsList',
});

Router.route('/', {
  name: 'home',
  controller: FragmentsListController
});

Router.route('/recent/:itemsLimit?', {name: 'fragmentsList'});