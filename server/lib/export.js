Meteor.methods({
  exportData: function () {
    check(Meteor.userId(), String);

    var collections = Collections.find({ user: Meteor.userId() }).fetch(),
        collectionsIds = _.map(collections, (c) => { return c._id }),
        fragments = Fragments.find({ 'collections._id': { $in: collectionsIds } }).fetch();

    return {
      collections, fragments
    }
  }
});