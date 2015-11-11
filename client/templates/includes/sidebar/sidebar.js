UI.setAutofocus(Template.sidebar, SIDEBAR_OPEN_KEY);

Template.sidebar.helpers({
  isOpen: function () {
    return Session.get(SIDEBAR_OPEN_KEY);
  },
  collections: function () {
    return Template.instance().collections;
  }
});

Template.sidebar.onCreated(function () {
  this.collections = Collections.find({}, { sort: { name: 1 } });

  Tracker.autorun(function () {
    Session.set(MODAL_VISIBLE_KEY, Session.get(SIDEBAR_OPEN_KEY));
  });
})