Template.notification.helpers({
  progress: function () {
    return this.type === 'progress';
  }
});

Template.notification.events({
  'click [data-dismiss]': function (event) {
    event.preventDefault();
    Notifications.remove(this._id);
  }
});