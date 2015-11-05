Template.header.helpers({
  displayName: function () {
    return Meteor.user().emails[0].address;
  }
});