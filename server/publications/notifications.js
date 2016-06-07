Meteor.publish('unreadNotifications', function () {
  if (!this.userId) {
    return this.stop();
  }

  Counts.publish(this, 'unread-notifications', Notifications.find({
    user: this.userId,
    read_at: null
  }));
})