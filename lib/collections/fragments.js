Fragments = new Mongo.Collection('Fragments');

Fragments.before.insert(function (userId, fragment) {
  fragment.created_at = Date.now();
});

Fragments.before.update(function (userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.updated_at = Date.now();
}, { fetchPrevious: false });

Meteor.methods({
  fragmentInsert: function(fragmentAttributes) {
    check(fragmentAttributes, {
      url: String
    });

    var fragment = _.extend(fragmentAttributes, {});

    fragment._id = Fragments.insert(fragment);

    return fragment._id;
  }
});