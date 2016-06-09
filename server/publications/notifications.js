Meteor.publish('notifications', function () {
  return Notifications.find({
    user: this.userId
  }, {
    sort: { created_at: -1 },
    limit: 25
  });
});