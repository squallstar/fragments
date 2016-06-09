var startedAt = Date.now();

Meteor.startup(function () {
  Tracker.autorun(function () {
    if (Meteor.userId()) {
      Meteor.subscribe('notifications');

      if (Notification && Notification.permission !== 'granted') {
        Notification.requestPermission(function (permission) {
          Notification.permission = permission;
        });
      }

      Notifications.find({ read_at: null }).observe({
        added: function (notification) {
          if (!Notification || Notification.permission !== 'granted' || notification.created_at < startedAt) {
            return;
          }

          var title, body;

          switch (notification.type) {
            case 'comment':
              title = 'New comment';
              body = notification.data.comment;
              break;
            case 'fragment-added':
              title = 'New fragment';
              body = notification.data.url;
              break;
            default:
              return;
          }

          var browserNotification = new Notification(title + ' from ' + notification.from.name, {
            icon: notification.from.picture,
            body: body
          });

          browserNotification.onclick = function () {
            Session.set(RIGHT_SIDEBAR_OPEN_KEY, true);
          };
        }
      });
    }
  });
});