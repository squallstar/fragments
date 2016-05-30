Meteor.methods({
  generateCollaborationToken: function (collectionId) {
    var user = Meteor.user(),
        collection;

    check(user._id, String);
    check(collectionId, String);

    collection = Collections.findOne(collectionId);

    if (!collection) {
      throw new Meteor.Error(404, 'The collection does not exist.');
    }

    if (collection.user !== user._id) {
      throw new Meteor.Error(400, 'Only the owner can generate a collaboration token for this collection');
    }

    if (collection.collaboration_token) {
      return;
    }

    Collections.update(collectionId, {
      $set: {
        collaboration_token: ShortId.generate()
      },
      $addToSet: {
        collaborators: {
          _id: user._id,
          name: user.profile.name,
          picture: user.profile.picture,
          role: 'owner'
        }
      }
    });
  },
  getCollaborationCollection: function (token) {
    check(token, String);

    return Collections.findOne({
      collaboration_token: token
    });
  },
  joinCollaborateCollection: function (token) {
    var user = Meteor.user(),
        collection;

    check(user._id, String);
    check(token, String);

    collection = Collections.findOne({
      collaboration_token: token
    });

    if (!collection) {
      throw new Meteor.Error(404, 'The collection does not exist.');
    }

    Collections.update(collection._id, {
      $addToSet: {
        collaborators: {
          _id: user._id,
          name: user.profile.name,
          picture: user.profile.picture,
          role: 'member'
        }
      }
    });

    return collection;
  },
  leaveCollaborationCollection: function (collectionId) {
    check(collectionId, String);

    Collections.update(collectionId, {
      $pull: {
        collaborators: {
          '_id': Meteor.userId()
        }
      }
    });
  },
  removeCollaborator: function (collectionId, collaboratorId) {
    check(collectionId, String);
    check(collaboratorId, String);

    var collection = Collections.findOne(collectionId);

    if (!collection) {
      throw new Meteor.Error(404, 'The collection does not exist.');
    }

    if (collection.user !== Meteor.userId()) {
      throw new Meteor.Error(400, 'Only the owner of this collection can remove a collaborator.');
    }

    Collections.update(collectionId, {
      $pull: {
        collaborators: {
          '_id': collaboratorId
        }
      }
    });
  }
});