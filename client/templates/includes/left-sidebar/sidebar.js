// UI Hooks
UI.setScrollBoundaries(Template.sidebar, '#left-sidebar');

Template.sidebar.helpers({
  isOpen: function () {
    return Session.get(SIDEBAR_OPEN_KEY);
  },
  collections: function () {
    return Template.instance().collections;
  },
  isAllCollections: function () {
    return !Session.get(CURRENT_COLLECTION_KEY) && !Session.get(FAVOURITES_ONLY);
  },
  isFavourites: function () {
    return Session.get(FAVOURITES_ONLY);
  },
  isAddingNewCollection: function () {
    return Session.get(SIDEBAR_ADDING_COLLECTION);
  },
  sidebarIsPinned: function () {
    return Session.get(MODAL_PINNED_KEY);
  }
});

Template.sidebar.events({
  'click [data-close]': function () {
    Session.set(SIDEBAR_OPEN_KEY, false);
  },
  'click [data-add-collection]': function (event, template) {
    event.preventDefault();
    Session.set(SIDEBAR_ADDING_COLLECTION, true);
  },
  'click [data-pin]': function (event) {
    event.preventDefault();

    var newStatus = localStorage.getItem('sidebar-status') === 'pinned'
      ? 'unpinned'
      : 'pinned';

    localStorage.setItem('sidebar-status', newStatus);
    Session.set(MODAL_PINNED_KEY, newStatus === 'pinned');

    Meteor.forceLayoutRecollect();
  }
});

Template.sidebar.onCreated(function () {
  this.collections = Meteor.visibleCollections();

  // Default the sidebar as pinned
  if (!localStorage.getItem('sidebar-status')) {
    localStorage.getItem('sidebar-status', 'pinned');
  }

  Tracker.autorun(function () {
    Session.set(MODAL_PINNED_KEY, localStorage.getItem('sidebar-status') === 'pinned');

    if (Session.get(MODAL_PINNED_KEY)) {
      Session.set(SIDEBAR_OPEN_KEY, true);
    }

    $('html').toggleClass('sidebar-pinned', Session.get(MODAL_PINNED_KEY));

    Session.set(MODAL_VISIBLE_KEY, Session.get(SIDEBAR_OPEN_KEY));
  });
});