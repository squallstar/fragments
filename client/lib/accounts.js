Accounts.onLogin(function () {
  Meteor.subscribe('collections');
});