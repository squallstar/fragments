Template.header.helpers({
  userTooltipIsOpen: function () {
    return Session.get(USER_TOOLTIP_KEY);
  },
  hasBackArrow: function () {
    return Session.get(HAS_BACK_ARROW);
  }
});

Template.header.events({
  'click [data-toggle-tooltip]': function (event) {
    event.preventDefault();
    Session.set(USER_TOOLTIP_KEY, !Session.get(USER_TOOLTIP_KEY));
  },
  'click [data-nav-toggle]': function (event) {
    var $el = $(event.currentTarget);
    event.preventDefault();

    if (Session.get(HAS_BACK_ARROW)) {
      history.back();
    } else {
      // Open menu
    }
  }
});