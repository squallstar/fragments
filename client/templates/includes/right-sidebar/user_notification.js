Template.userNotification.events({
  'click .time a': function (event, template) {
    event.preventDefault();
    Meteor.call('markNotificationAsRead', template.data._id);
  }
});