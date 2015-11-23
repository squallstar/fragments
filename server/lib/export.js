Meteor.methods({
  exportData: function () {
    var userId = Meteor.userId();

    check(userId, String);

    var collections = Collections.find({ user: userId }).fetch(),
        collectionsIds = _.map(collections, (c) => { return c._id }),
        fragments = Fragments.find({
          $or: [
            { user: userId },
            { 'collections._id': { $in: collectionsIds } }
          ]
        }).fetch();

    return {
      collections, fragments
    }
  }
});