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
    var email = options.email || user.services[_.keys(user.services)[0]].email;

    var emailExists = Meteor.users.findOne({ 'emails.address': email })
      || Meteor.users.findOne({ 'services.google.email': email });

    if (emailExists) {
      throw new Meteor.Error(409, 'The email address ' + email + ' has already being used.');
    }

    if (!user.profile) {
      user.profile = options.profile || {};
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