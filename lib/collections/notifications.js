// Collection
Notifications = new Mongo.Collection('Notifications');

// Hooks to be triggered before insert
Notifications.before.insert(function (userId, notification) {
  notification.created_at = Date.now();
  notification.read_at = null;
});

Meteor.methods({
  markNotificationAsRead: function (notificationId) {
    var userId = Meteor.userId();

    check(userId, String);
    check(notificationId, String);

    return Notifications.update(notificationId, {
      $set: {
        read_at: Date.now()
      }
    });
  },
  markAllNotificationsAsRead: function () {
    var userId = Meteor.userId();

    check(userId, String);

    return Notifications.update({
      user: userId
    }, {
      $set: {
        read_at: Date.now()
      }
    }, {
      multi: true
    });
  }
})