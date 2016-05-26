Meteor.methods({
  generateCollaborationToken: function (collectionId) {
    var userId = Meteor.userId(),
        collection;

    check(userId, String);
    check(collectionId, String);

    collection = Collections.findOne(collectionId);

    if (!collection) {
      throw new Meteor.Error(404, 'The collection does not exist.');
    }

    if (collection.user !== userId) {
      throw new Meteor.Error(400, 'Only the owner can generate a collaboration token for this collection');
    }

    if (collection.collaboration_token) {
      return;
    }

    Collections.update(collectionId, {
      $set: {
        collaboration_token: ShortId.generate()
      }
    });
  }
});