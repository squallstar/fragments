// Cleanup user data when is removed
Meteor.users.after.remove(function (userId, doc) {
  _.each([Fragments, Collections, SearchHistory], function (collectionName) {
    collectionName.remove({user: doc._id});
  });
});