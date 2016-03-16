Meteor.ownedCollections = function () {
  return Collections.find({ user: Meteor.userId() }, { sort: { slug: 1 } });
}