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
    if (typeof user.profile !== 'object') {
      user.profile = {};
    }

    if (user.services.google !== undefined) {
      user.profile.picture = user.services.google.picture;
      user.profile.name = user.services.google.name;
    }

    if (!user.profile.picture) {
      user.profile.picture = '/assets/img/default-avatar.png';
    }

    if (!user.profile.name) {
      user.profile.name = user.emails[0].address;
    }

    Meteor.call('createTutorial', user);

    return user;
  });

  Accounts.urls.resetPassword = function (token) {
    return Router.url('reset_password', { token: token });
  };
});