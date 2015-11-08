Template.header.helpers({
  userTooltipIsOpen: function () {
    return Session.get(USER_TOOLTIP_KEY);
  }
});

Template.header.events({
  'click [data-toggle-tooltip]': function (event) {
    event.preventDefault();
    Session.set(USER_TOOLTIP_KEY, !Session.get(USER_TOOLTIP_KEY));
  },
  'click h1': function (event) {
    event.preventDefault();
    Router.go('/');
  }
});