Meteor.startup(function() {
  Accounts.urls.resetPassword = function (token) {
    return Router.url('reset_password', { token: token });
  };
});