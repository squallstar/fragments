Template.layout.helpers({
  withModal: function () {
    if (Session.get(RIGHT_SIDEBAR_OPEN_KEY)) {
      return true;
    }

    return Session.get(MODAL_VISIBLE_KEY) && !Session.get(MODAL_PINNED_KEY);
  },
  shouldDisplayHeader: function () {
    return Meteor.userId() || Session.get(CURRENT_COLLECTION_KEY);
  }
});