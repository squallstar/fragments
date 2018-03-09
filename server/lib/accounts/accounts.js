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

    // Set up default avatar
    if (!user.profile.picture) {
      user.profile.picture = Meteor.absoluteUrl('assets/img/default-avatar.png');
    }

    // Set up default name
    if (!user.profile.name) {
      user.profile.name = user.emails ? user.emails[0].address : 'User';
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
  },
  resyncCollaborationDetails: function () {
    Meteor.users.find().forEach(function (user) {
      const name = user.profile.name;
      const picture = user.profile.picture;

      if (!name || !picture) {
        return;
      }

      Collections.update({
        'collaborators._id': user._id
      }, {
        $set: {
          'collaborators.$.name': name,
          'collaborators.$.picture': picture
        }
      }, {
        multi: true
      });
    });
  },
  setOnboardingStage: function (stage) {
    var userId = Meteor.userId();

    check(stage, Number);
    check(userId, String);

    Meteor.users.update(userId, {
      $set: {
        'profile.onboarding': stage
      }
    });
  }
});

Meteor.startup(function () {
  Meteor.call('resyncCollaborationDetails');
});