UI.Notification = {
  error: function (message) {
    return Session.set(NOTIFICATION_KEY, {
      type: 'error',
      message: message
    });
  }
};