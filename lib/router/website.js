Router.route('/', {
  name: 'website',
  layoutTemplate: 'websiteLayout',
  seo: {
    title: 'Collect and organise your articles'
  },
  action: function () {
    if (Meteor.user()) {
      return Router.go('home');
    }

    if (Meteor.loggingIn()) {
      return this.render(this.loadingTemplate);
    }

    this.render('websiteIndex');
  }
});