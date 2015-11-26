/*
 * Collection
 *
 * MODEL SCHEMA
 * _id: ObjectId
 * name: String
 * slug: String
 * color: String (HEX color)
 * created_at: Date
 * is_hidden: Boolean, defaults false
 * is_public: Boolean, defaults true

*/

// Collection
Collections = new Mongo.Collection('Collections');

Collections.shrink = function (collection) {
  return {
    _id: collection._id,
    name: collection.name,
    color: collection.color
  };
}

function name2slug (name) {
  return (name || '').toLowerCase();
}

// Hooks to be triggered before insert
Collections.before.insert(function (userId, collection) {
  collection.created_at = Date.now();
  collection.slug = name2slug(collection.name);
  collection.is_hidden = collection.is_hidden || false;
  collection.is_public = collection.is_public || true;
});

// Hooks to be triggered before update
Collections.before.update(function (userId, doc, fieldNames, modifier, options) {
  if (modifier.$set && modifier.$set.name) {
    modifier.$set.slug = name2slug(modifier.$set.name);
  }
}, { fetchPrevious: false });

Collections.after.update(function (userId, collection, fieldNames, modifier, options) {
  if (modifier.$set) {
    // Update denormalized data
    Fragments.update(
      { 'collections._id': collection._id },
      { $set: { 'collections.$': Collections.shrink(collection) } },
      { multi: true }
    );
  }
}, { fetchPrevious: false });

Collections.after.remove(function (userId, collection) {
  // Remove references to this collection
  Fragments.update(
    { 'collections._id': collection._id },
    { $pull: { collections: { _id: collection._id } } },
    { multi: true }
  );
});

Meteor.methods({
  collectionInsert: function (attributes) {
    attributes.user = Meteor.userId() || attributes.user;

    check(attributes, {
      name: Match.NonEmptyString,
      user: String,
      color: Match.Optional(Match.OneOf(Match.HexColor, undefined))
    });

    var collection = {
      name: attributes.name,
      user: attributes.user,
      color: attributes.color || _.sample(Object.keys(COLOR_THEMES))
    };

    return Collections.insert(collection);
  },
  collectionUpdate: function (collectionId, attributes) {
    check(Meteor.userId(), String);
    check(collectionId, String);
    check(attributes, {
      name: Match.Optional(Match.NonEmptyString),
      color: Match.Optional(Match.HexColor),
      is_hidden: Match.Optional(Boolean),
      is_public: Match.Optional(Boolean)
    });

    var collection = Collections.findOne(collectionId);

    if (!collection) {
      throw new Meteor.Error(404, 'The collection has not been found');
    }

    if (collection.user !== Meteor.userId()) {
      throw new Meteor.Error(403, 'You have no rights to update this collection');
    }

    var affected = Collections.update(collectionId, { $set: attributes });

    if (!affected) {
      throw new Meteor.Error(400, 'You weren\'t able to update this collection');
    }
  },
  collectionDelete: function (collectionId) {
    check(Meteor.userId(), String);
    check(collectionId, String);

    var collection = Collections.findOne(collectionId);

    if (!collection) {
      throw new Meteor.Error(404, 'The collection has not been found');
    }

    if (collection.user !== Meteor.userId()) {
      throw new Meteor.Error(403, 'You have no rights to delete this collection');
    }

    var affected = Collections.remove(collectionId);

    if (!affected) {
      throw new Meteor.Error(400, 'You weren\'t able to delete this collection');
    }
  }
});