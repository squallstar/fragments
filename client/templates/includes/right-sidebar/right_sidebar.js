// UI Hooks
UI.setScrollBoundaries(Template.rightSidebar, '#right-sidebar');

Template.rightSidebar.helpers({
  isOpen: function () {
    return Session.get(RIGHT_SIDEBAR_OPEN_KEY);
  },
  notifications: function () {
    return Notifications.find({}, {
      sort: { created_at: -1 }
    });
  }
});

Template.sidebar.events({
  'click [data-close]': function () {
    Session.set(RIGHT_SIDEBAR_OPEN_KEY, false);
  }
});

Template.rightSidebar.onCreated(function () {
  this.subscribe('notifications');

  Tracker.autorun(function () {
    Session.set(MODAL_VISIBLE_KEY, Session.get(RIGHT_SIDEBAR_OPEN_KEY));
  });
});