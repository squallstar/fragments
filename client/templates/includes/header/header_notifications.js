Template.headerNotifications.helpers({
  notifications: function () {
    return Notifications.find({}, {
      sort: { created_at: -1 }
    });
  }
});

Template.headerNotifications.onCreated(function () {
  this.subscribe('notifications');
});