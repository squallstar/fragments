// const DISMISS_AFTER_SECONDS = 3;

Template.notifications.helpers({
  notifications: function () {
    return Notifications.find();
  }
});

Template.notifications.onRendered(function () {
  this.find('#notifications')._uihooks = {
    insertElement: (node, next) => {
      var $node = $(node);

      $node.hide().insertBefore(next).slideDown(300);
    },
    removeElement: (node) => {
      var $node = $(node);
      $node.slideUp(300, function () {
        $node.remove();
      });
    }
  }
});