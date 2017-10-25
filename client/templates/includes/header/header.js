Template.header.helpers({
  userTooltipIsOpen: function () {
    return Session.get(USER_TOOLTIP_KEY);
  },
  hasSearchBar: function () {
    return Meteor.userId() && Session.get(HIDE_SEARCH_BAR) !== true;
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
  favourites: function() {
    console.log('f', Session.get(FAVOURITES_ONLY))
    return Session.get(FAVOURITES_ONLY);
  },
  collectionOwner: function () {
    var collection = Session.get(CURRENT_COLLECTION_KEY),
        userId = Meteor.userId(),
        owner;

    if (collection && collection.collaborators) {
      if (collection.user === userId) {
        return;
      }

      owner = _.find(collection.collaborators, (c) => { return c._id === collection.user; });

      if (userId && owner) {
        owner.name = owner.name.split(' ')[0];
      }

      return owner;
    }
  },
  unreadNotificationsCount: function () {
    return Notifications.find({ read_at: null }).count();
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