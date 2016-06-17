Meteor.startup(function() {
  // Configure keys for Google accounts
  ServiceConfiguration.configurations.upsert({ service: 'google' }, { $set: {
    clientId: Meteor.settings.googleClientId,
    secret: Meteor.settings.googleClientSecret
  }});

  // Configure keys for Twitter accounts
  ServiceConfiguration.configurations.upsert({ service: 'twitter' }, { $set: {
    consumerKey: Meteor.settings.twitterConsumerId,
    secret: Meteor.settings.twitterConsumerSecret
  }});

  // Hooks and checks when creating a user
  Accounts.onCreateUser(function (options, user) {
    // Check whether the email address has already been used
    var email = options.email || user.services[_.keys(user.services)[0]].email;
    var emailExists;

    if (email) {
      emailExists = Meteor.users.findOne({ 'emails.address': email })
      || Meteor.users.findOne({ 'services.google.email': email });
    }

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
    // Grab name and thumbnail from Google Account
    else if (user.services.twitter !== undefined) {
      user.profile.picture = user.services.twitter.profile_image_url;
      user.profile.name = user.services.twitter.screenName;
    }
    // Grap profile picture from gravatar
    else {
      var url = Gravatar.imageUrl(email, {
        secure: true
      });
      var isGravatarUrl = true;
      // Try to get picture if user doesn't have gravatar return 404
      try {
        HTTP.call('GET', url, {params: {d: 404}});
      } catch (e) {
        isGravatarUrl = false;
      }
      if (isGravatarUrl) {
        user.profile.picture = url;
      }
    }

    // Set up default avatar
    if (!user.profile.picture) {
      user.profile.picture = Meteor.absoluteUrl('assets/img/default-avatar.png');
    }

    // Set up default name
    if (!user.profile.name) {
      user.profile.name = user.emails[0].address;
    }

    // Creates some basic stuff for the user, like sample collections and cards
    Meteor.call('createTutorial', user);

    return user;
  });
});

Meteor.methods({
  updateProfilePicture: function (imageUrl) {
    var userId = Meteor.userId();

    check(userId, String);
    check(imageUrl, String);

    Meteor.users.update(userId, {
      $set: {
        'profile.picture': imageUrl
      }
    });

    Notifications.update({
      'from._id': userId
    }, {
      $set: {
        'from.picture': imageUrl
      }
    }, {
      multi: true
    });

    Fragments.update({
      'user._id': userId
    }, {
      $set: {
        'user.picture': imageUrl
      }
    }, {
      multi: true
    });

    Collections.update({
      'collaborators._id': userId
    }, {
      $set: {
        'collaborators.$.picture': imageUrl
      }
    }, {
      multi: true
    });
  }
})
