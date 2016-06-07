Tracker.autorun(function () {
  if (Meteor.user()) {
    Meteor.subscribe('collections');
    Meteor.subscribe('unreadNotifications');
  }
});