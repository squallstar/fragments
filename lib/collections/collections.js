// Collection
Collections = new Mongo.Collection('Collections');

Collections.shrink = function (collection) {
  return {
    _id: collection._id,
    name: collection.name,
    color: collection.color
  };
}

var name2slug = function (name) {
  return (name || '').toLowerCase();
}

// Hooks to be triggered before insert
Collections.before.insert(function (userId, collection) {
  collection.created_at = Date.now();
  collection.slug = name2slug(collection.name);
});

// Hooks to be triggered before update
Collections.before.update(function (userId, doc, fieldNames, modifier, options) {
  if (modifier.$set && modifier.$set.name) {
    modifier.$set.slug = name2slug(collection.name);
  }
}, { fetchPrevious: false });

Meteor.methods({
  collectionInsert: function (attributes) {
    attributes.user = Meteor.userId() || attributes.user;

    check(attributes, {
      name: String,
      user: String,
      color: Match.Optional(Match.OneOf(String, undefined))
    });

    var collection = {
      name: attributes.name,
      user: attributes.user,
      color: attributes.color || _.sample(Object.keys(COLOR_THEMES))
    };

    return Collections.insert(collection);
  }
});