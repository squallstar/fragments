Tracker.autorun(function () {
  if (Meteor.userId()) {
    Meteor.subscribe('collections');
    Meteor.subscribe('unreadNotifications');
  }
});