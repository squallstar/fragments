Template.header.helpers({
  displayName: function () {
    return Meteor.user().profile.name;
  },
  profilePicture: function () {
    return Meteor.user().profile.picture;
  }
});