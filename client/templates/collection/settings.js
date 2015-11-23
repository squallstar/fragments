Template.collectionSettings.helpers({
  showInDashboard: function() {
    return !this.collection.hidden;
  }
});

Template.collectionSettings.events({
  'submit form': function (event, template) {
    event.preventDefault();

    var collection = this.collection;

    var attributes = {
      name: template.$('input[name="name"]').val().trim(),
      color: $('input[name="color"]:checked').val(),
      hidden: !$('input[name="show_in_dashboard"]').is(':checked')
    };

    Meteor.call('collectionUpdate', collection._id, attributes, (error) => {
      if (error) {
        return Notifications.error(error.reason);
      }

      Router.go('collection', collection);
    });
  },
  'click [data-delete]': function (event) {
    event.preventDefault();
    Meteor.call('collectionDelete', this.collection._id, function (error) {
      if (error) {
        return Notifications.error(error.reason);
      }

      Notifications.success('The collection has been deleted');
      Router.go('/');
    });
  }
});