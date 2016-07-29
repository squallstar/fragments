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
    event.stopPropagation();
    Meteor.call('markNotificationAsRead', template.data._id);
  },
  'click li': function (event, template) {
    var fragment = template.fragment.get();

    Meteor.call('markNotificationAsRead', template.data._id);

    if (fragment) {
      let data = { text: 'fragment:' + fragment._id },
          opts = {};

      if (this.type === 'comment') {
        opts.query = { c: fragment._id };
      }

      Session.set(RIGHT_SIDEBAR_OPEN_KEY, false);
      Session.set(CURRENT_COLLECTION_KEY, null);
      Session.set(CURRENT_TAG_KEY, null);

      Router.go('searchResults', data, opts);
    }
  }
});