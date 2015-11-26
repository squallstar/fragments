Template.sidebarAddCollection.onRendered(function () {
  this.$('input[name="name"]').focus();
});

Template.sidebarAddCollection.helpers({
  colors: function () {
    return _.keys(COLOR_THEMES);
  }
});

Template.sidebarAddCollection.events({
  'submit form': function (event, template) {
    event.preventDefault();

    var collection = {
      name: template.$('input[name="name"]').val(),
      color: template.$('input[name="color"]:checked').val() || undefined
    };

    if (!collection.name) {
      return Notifications.error('You need to specify a name for the collection.');
    }

    Meteor.call('collectionInsert', collection, function (err, id) {
      if (err) {
        return Notifications.error(err);
      }

      Session.set(SIDEBAR_ADDING_COLLECTION, false);
      Session.set(SIDEBAR_OPEN_KEY, false);
      Router.go('collection', { _id: id });
    });
  }
});