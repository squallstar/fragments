Tracker.autorun(function () {
  if (Meteor.user()) {
    Meteor.subscribe('collections');
  }
});