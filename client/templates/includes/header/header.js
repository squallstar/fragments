Template.header.helpers({
  userTooltipIsOpen: function () {
    return Session.get(USER_TOOLTIP_KEY);
  },
  hasSearchBar: function () {
    return Session.get(HIDE_SEARCH_BAR) !== true;
  },
  hasBackArrow: function () {
    return Session.get(HAS_BACK_ARROW_KEY);
  },
  collection: function () {
    return Session.get(CURRENT_COLLECTION_KEY);
  },
  theme: function () {
    var collection = Session.get(CURRENT_COLLECTION_KEY);
    if (collection) {
      return COLOR_THEMES[collection.color];
    }
  },
  unreadNotificationsCount: function () {
    return Counts.get('unread-notifications');
  }
});

Template.header.events({
  'click [data-toggle-tooltip]': function (event) {
    event.preventDefault();
    Session.set(USER_TOOLTIP_KEY, !Session.get(USER_TOOLTIP_KEY));
  },
  'click [data-toggle-notifications]': function (event, template) {
    event.preventDefault();
    Session.set(RIGHT_SIDEBAR_OPEN_KEY, true);
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

Template.header.onRendered(function () {
  this.find('.middle-section')._uihooks = {
    insertElement: (node, next) => {
      var $node = $(node);
      $node.hide().insertBefore(next).fadeIn(250);
    },
    removeElement: (node) => {
      var $node = $(node);
      $node.fadeOut(250, function () {
        $node.remove();
      });
    }
  }
});