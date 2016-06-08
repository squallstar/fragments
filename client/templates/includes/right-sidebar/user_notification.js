Template.userNotification.helpers({
  fragment: function () {
    return Template.instance().fragment.get();
  }
});

Template.userNotification.onCreated(function () {
  if (this.data.resource) {
    this.fragment = new ReactiveVar();

    Meteor.call('getFragmentTopData', this.data.resource, (err, fragment) => {
      fragment.collections = _.compact(fragment.collections.map(function (c) {
        return Collections.findOne(c._id);
      }));

      this.fragment.set(fragment);
    });
  }
});

Template.userNotification.events({
  'click .collection': function (event) {
    Session.set(RIGHT_SIDEBAR_OPEN_KEY, false);
  },
  'click .time a': function (event, template) {
    event.preventDefault();
    Meteor.call('markNotificationAsRead', template.data._id);
  }
});