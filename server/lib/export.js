Meteor.methods({
  exportData: function () {
    console.log(Meteor.userId());
    check(Meteor.userId(), String);

    var collections = Collections.find({ user: Meteor.userId() }).map(function (collection) {
      collection.fragments = Fragments.find({ 'collections._id': collection }).fetch();
      return collection;
    });

    return {
      collections
    }
  }
});