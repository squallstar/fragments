Template.sidebar.helpers({
  isOpen: function () {
    return Session.get(SIDEBAR_OPEN_KEY);
  },
  collections: function () {
    return Template.instance().collections;
  },
  hasActiveCollection: function () {
    return Session.get(CURRENT_COLLECTION_KEY);
  }
});

Template.sidebar.events({
  'click a': function () {
    Session.set(SIDEBAR_OPEN_KEY, false);
  }
});

Template.sidebar.onCreated(function () {
  this.collections = Collections.find({}, { sort: { name: 1 } });

  Tracker.autorun(function () {
    Session.set(MODAL_VISIBLE_KEY, Session.get(SIDEBAR_OPEN_KEY));
  });
})