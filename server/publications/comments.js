Meteor.publish('fragmentComments', function (fragmentId) {
  check(fragmentId, String);

  if (this.userId) {
    Notifications.update({
      user: this.userId,
      resource: fragmentId
    }, {
      $set: { read_at: Date.now() }
    }, {
      multi: true
    });
  }

  return Comments.find({
    fragment: fragmentId
  });
});