Meteor.startup(function () {
  Comments.after.insert(function (userId, comment) {
    Meteor.call('getFragmentCollaborators', userId, comment.fragment, function (err, response) {
      if (err || !response) {
        return;
      }

      var collaborators = response.collaborators,
          fragment = response.fragment;

      if (!collaborators.length) {
        return;
      }

      var user = Meteor.users.findOne(userId, {
        profile: 1
      });

      collaborators.forEach(function (collaboratorId) {
        Notifications.insert({
          from: {
            _id: userId,
            picture: user.profile.picture,
            name: user.profile.name
          },
          user: collaboratorId,
          type: 'comment',
          resource: comment.fragment,
          data: {
            fragment: {
              title: fragment.title
            },
            comment: comment.text
          }
        });
      });
    });
  });
});