Meteor.startup(function() {
  Accounts.loginServiceConfiguration.remove({
    service: 'google'
  });

  Accounts.loginServiceConfiguration.insert({
    service: 'google',
    clientId: Meteor.settings.googleClientId,
    secret: Meteor.settings.googleClientSecret
  });

  Accounts.urls.resetPassword = function (token) {
    return Router.url('reset_password', { token: token });
  };
});