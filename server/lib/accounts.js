Meteor.startup(function() {
  Accounts.loginServiceConfiguration.remove({
    service: 'google'
  });

  Accounts.loginServiceConfiguration.insert({
    service: 'google',
    clientId: Meteor.settings.googleClientId,
    secret: Meteor.settings.googleClientSecret
  });

  Accounts.onCreateUser(function (options, user) {
    if (user.services.google !== undefined) {
      if (!user.profile) {
        user.profile = {};
      }
      user.profile.picture = user.services.google.picture;
    }

    return user;
  });

  Accounts.urls.resetPassword = function (token) {
    return Router.url('reset_password', { token: token });
  };
});