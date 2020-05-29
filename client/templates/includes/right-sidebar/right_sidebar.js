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
  },
  hasNotifications: function () {
    return Notifications.find().count() > 0;
  },
  hasUnreadNotifications: function () {
    return Notifications.find({ read_at: null }).count() > 1;
  }
});

Template.sidebar.events({
  'click [data-close]': function () {
    Session.set(RIGHT_SIDEBAR_OPEN_KEY, false);
  }
});

Template.rightSidebar.events({
  'click [data-mark-all]': function (event) {
    event.preventDefault();
    Meteor.call('markAllNotificationsAsRead');
  }
});

Template.rightSidebar.onCreated(function () {
  Tracker.autorun(() => {
    var isOpen = Session.get(RIGHT_SIDEBAR_OPEN_KEY);
    Session.set(MODAL_VISIBLE_KEY, isOpen);
  });
});