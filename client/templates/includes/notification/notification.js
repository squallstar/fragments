const DISMISS_AFTER_SECONDS = 3;

Template.notification.helpers({
  notification: function () {
    return Session.get(NOTIFICATION_KEY);
  }
});

Template.notification.onRendered(function () {
  var instance = this;

  Tracker.autorun(function () {
    if (Session.get(NOTIFICATION_KEY)) {
      if (instance._t) {
        clearTimeout(instance._t);
      }
      instance._t = setTimeout(clearNotification, DISMISS_AFTER_SECONDS * 1000);
    }
  });

  function clearNotification () {
    Session.set(NOTIFICATION_KEY, undefined);
  }

});