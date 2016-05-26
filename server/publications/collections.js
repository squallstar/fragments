Meteor.publish('collections', function () {
  if (!this.userId) {
    return this.stop();
  }

  check(this.userId, String);

  return Collections.find({
    $or: [
      { user: this.userId },
      { 'collaborators._id': this.userId }
    ]
  });
});

Meteor.publish('collection', function (id) {
  check(id, String);

  var $conditions = [{ _id: id, is_public: true }];
  if (this.userId) {
    $conditions.push({ _id: id, user: this.userId });
    $conditions.push({ _id: id, 'collaborators._id': this.userId });
  }

  return Collections.find({ $or: $conditions });
});