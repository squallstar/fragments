Router.route('/', {
  name: 'website',
  where: 'server',
  action: function () {
    if (this.request.cookies.meteor_login_token) {
      // Redirects to app
      this.response.writeHead(302, {
        'Location': Router.path('home')
      });

      return this.response.end();
    }

    // Sends the homepage
    this.response.end(Meteor.Website.index());
  }
}, { where: 'server' });