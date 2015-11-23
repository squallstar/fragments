Template.account.events({
  'click [data-export]': function (event) {
    event.preventDefault();
    var notification = Notifications.progress('Preparing your data...');
  }
});