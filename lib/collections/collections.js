// Collection
Collections = new Mongo.Collection('Collections');

Collections.mini = function (collection) {
  return {
    _id: collection._id,
    name: collection.name,
    color: collection.color
  };
}

Meteor.methods({
  collectionInsert: function (attributes) {
    attributes.user = Meteor.userId() || attributes.user;

    check(attributes, {
      name: String,
      user: String,
      color: Match.Optional(String)
    });

    var collection = {
      name: attributes.name,
      user: attributes.user,
      color: attributes.color || _.sample(Object.keys(COLOR_THEMES))
    };

    return Collections.insert(collection);
  }
});