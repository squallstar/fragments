Meteor.ownedCollections = function () {
  return Collections.find({ user: Meteor.userId() }, { sort: { slug: 1 } });
};

Meteor.visibleCollections = function () {
  var userId = Meteor.userId();

  return Collections.find({
    $or: [
      { user: userId },
      { 'collaborators._id': userId }
    ]
  }, { sort: { slug: 1 } });
};