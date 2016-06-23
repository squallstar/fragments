// UI Hooks
UI.setScrollBoundaries(Template.sidebar, '#left-sidebar');

Template.sidebar.helpers({
  isOpen: function () {
    return Session.get(SIDEBAR_OPEN_KEY);
  },
  collections: function () {
    return Template.instance().collections;
  },
  hasActiveCollection: function () {
    return Session.get(CURRENT_COLLECTION_KEY);
  },
  isAddingNewCollection: function () {
    return Session.get(SIDEBAR_ADDING_COLLECTION);
  }
});

Template.sidebar.events({
  'click [data-close]': function () {
    Session.set(SIDEBAR_OPEN_KEY, false);
  },
  'click [data-add-collection]': function (event, template) {
    event.preventDefault();
    Session.set(SIDEBAR_ADDING_COLLECTION, true);
  }
});

Template.sidebar.onCreated(function () {
  this.collections = Meteor.visibleCollections();

  Tracker.autorun(function () {
    Session.set(MODAL_VISIBLE_KEY, Session.get(SIDEBAR_OPEN_KEY));
  });
});