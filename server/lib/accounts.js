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
    // Check whether the email address has already been used
    if (Meteor.users.findOne({ 'emails.address': user.emails[0] })) {
      throw new Meteor.Error('The email address ' + email + ' has already being used in our systems!');
    }

    if (typeof user.profile !== 'object') {
      user.profile = {};
    }

    // Grab name and thumbnail from Google Account
    if (user.services.google !== undefined) {
      user.profile.picture = user.services.google.picture;
      user.profile.name = user.services.google.name;
    }

    // Set up default avatar
    if (!user.profile.picture) {
      user.profile.picture = '/assets/img/default-avatar.png';
    }

    // Set up default name
    if (!user.profile.name) {
      user.profile.name = user.emails[0].address;
    }

    // Creates some basic stuff for the user, like sample collections and cards
    Meteor.call('createTutorial', user);

    return user;
  });

  Accounts.urls.resetPassword = function (token) {
    return Router.url('reset_password', { token: token });
  };
});