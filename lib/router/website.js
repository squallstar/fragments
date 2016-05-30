Router.route('/', {
  name: 'website',
  layoutTemplate: 'websiteLayout',
  seo: {
    title: 'Collect and organise your articles'
  },
  action: function () {
    if (Meteor.loggingIn() || Meteor.user()) {
      return Router.go('home');
    }

    this.render('websiteIndex');
  }
});