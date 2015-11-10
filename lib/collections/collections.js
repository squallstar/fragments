// Collection
Collections = new Mongo.Collection('Collections');

const colors = ['#FF0000', '#00FFFF'];

Meteor.methods({
  collectionInsert: function (attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      name: String
    });

    var collection = {
      name: attributes.name,
      user: Meteor.userId(),
      color: _.sample(colors)
    };

    return Collections.insert(collection);
  }
});