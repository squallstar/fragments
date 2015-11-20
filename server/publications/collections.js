Meteor.publish('collections', function () {
  return Collections.find({ user: this.userId });
});

Meteor.publish('collection', function (id) {
  check(id, String);
  return Collections.find(id);
});