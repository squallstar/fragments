Template.addFragmentPopup.helpers({
  fragment: function () {
    return Fragments.findOne(Template.instance().fragmentId.get());
  }
});

Template.addFragmentPopup.onCreated(function () {
  this.fragmentId = new ReactiveVar();

  Meteor.call('fragmentInsert', { url: this.data }, (error, fragmentId) => {
    if (error) {
      return Notifications.error(error);
    }

    this.fragmentId.set(fragmentId);

    Meteor.subscribe('fragments', {
      _id: fragmentId
    });

    Notifications.success(_.sample(['All done!', 'Saved!', 'Got it!']));
  });
});