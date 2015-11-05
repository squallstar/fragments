Template.header.helpers({
  displayName: function () {
    return Meteor.user().profile.name;
  }
});