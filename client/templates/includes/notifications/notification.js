Template.notification.helpers({
  progress: function () {
    return this.type === 'progress';
  }
});

Template.notification.events({
  'click [data-dismiss]': function (event) {
    event.preventDefault();
    UINotification.remove(this._id);
  }
});