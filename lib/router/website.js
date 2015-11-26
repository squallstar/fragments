Router.route('/', {
  name: 'website',
  layoutTemplate: 'websiteLayout',
  template: 'websiteIndex'
});

// This is supposed to be the server-side route.
// Temporary disabled as I have no clue about how to integrate
// the current SCSS pipeline with this page.
// Router.route('/', {
//   name: 'website',
//   where: 'server',
//   action: function () {
//     if (this.request.cookies.meteor_login_token) {
//       // Redirects to app
//       this.response.writeHead(302, {
//         'Location': Router.path('home')
//       });

//       return this.response.end();
//     }

//     // Sends the homepage
//     this.response.end(Meteor.Website.index());
//   }
// }, { where: 'server' });