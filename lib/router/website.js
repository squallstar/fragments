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

    this.render('websiteIndex');
  }
});