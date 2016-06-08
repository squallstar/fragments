Template.modal.events({
  'click': function () {
    Session.set(MODAL_VISIBLE_KEY, false);
    Session.set(SIDEBAR_OPEN_KEY, false);
    Session.set(RIGHT_SIDEBAR_OPEN_KEY, false);
  }
});