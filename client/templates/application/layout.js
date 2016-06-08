Template.layout.helpers({
  withModal: function () {
    return Session.get(MODAL_VISIBLE_KEY);
  },
  shouldDisplayHeader: function () {
    return Meteor.userId() || Session.get(CURRENT_COLLECTION_KEY);
  }
});