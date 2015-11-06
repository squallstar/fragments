Template.header.helpers({
  displayName: function () {
    return Meteor.user().profile.name;
  },
  profilePicture: function () {
    return Meteor.user().profile.picture;
  },
  userTooltipIsOpen: function () {
    return Session.get(USER_TOOLTIP_KEY);
  }
});

Template.header.events({
  'click [data-toggle-tooltip]': function (event) {
    event.preventDefault();
    Session.set(USER_TOOLTIP_KEY, !Session.get(USER_TOOLTIP_KEY));
  }
});