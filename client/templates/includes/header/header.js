Template.header.helpers({
  userTooltipIsOpen: function () {
    return Session.get(USER_TOOLTIP_KEY);
  },
  hasBackArrow: function () {
    return Session.get(HAS_BACK_ARROW_KEY);
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
    event.stopPropagation();

    if (Session.get(HAS_BACK_ARROW_KEY)) {
      history.back();
    } else {
      Session.set(SIDEBAR_OPEN_KEY, true);
    }
  }
});