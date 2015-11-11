Template.layout.helpers({
  withModal: function () {
    return Session.get(MODAL_VISIBLE_KEY);
  }
});