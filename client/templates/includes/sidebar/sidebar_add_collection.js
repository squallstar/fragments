Template.sidebarAddCollection.onRendered(function () {
  this.$('input[name="name"]').focus();
});

Template.sidebarAddCollection.events({
  'submit form': function (event, template) {
    event.preventDefault();

    var collection = {
      name: template.$('input[name="name"]').val()
    };

    if (!collection.name) {
      return Notifications.error('You need to specify a name for the collection.');
    }

    Meteor.call('collectionInsert', collection);
    Session.set(SIDEBAR_ADDING_COLLECTION, false);
  }
});