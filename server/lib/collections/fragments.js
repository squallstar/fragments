Meteor.methods({
  getFragmentTopData: function (fragmentId) {
    check(Meteor.userId(), String);
    check(fragmentId, String);

    return Fragments.findOne(fragmentId, {
      fields: {
        title: 1,
        url: 1,
        domain: 1,
        lead_image: 1,
        'collections._id': 1
      }
    });
  }
});

Meteor.startup(function () {
  Fragments.after.insert(function (userId, fragment) {
    Meteor.call('getFragmentCollaborators', userId, fragment._id, function (err, response) {
      if (err || !response) {
        return;
      }

      var collaborators = response.collaborators,
          fragment = response.fragment;

      if (!collaborators.length) {
        return;
      }

      var user = Meteor.users.findOne(userId, {
        fields: {
          profile: 1
        }
      });

      collaborators.forEach(function (collaboratorId) {
        Notifications.insert({
          from: {
            _id: userId,
            picture: user.profile.picture,
            name: user.profile.name
          },
          user: collaboratorId,
          type: 'fragment-added',
          resource: fragment._id
        });
      });
    });
  });
});