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
    if (!user.profile) {
      user.profile = {};
    }

    if (user.services.google !== undefined) {
      user.profile.picture = user.services.google.picture;
    }

    if (!user.profile.picture) {
      user.profile.picture = '/assets/img/default-avatar.png';
    }

    return user;
  });

  Accounts.urls.resetPassword = function (token) {
    return Router.url('reset_password', { token: token });
  };
});