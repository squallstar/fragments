Template.fragmentItem.helpers({
  isFetching: function () {
    return this.fetched_at === null;
  },
  isEditing: function () {
    return Template.instance().isEditing.get();
  }
});

Template.fragmentItem.onCreated(function () {
  this.isEditing = new ReactiveVar(false);
});

Template.fragmentItem.onRendered(function () {
  this.autorun(() => {
    if (this.isEditing.get() && !Session.get('modal')) {
      this.isEditing.set(false);
      saveChanges.call(this);
    }
  });
});

function saveChanges () {
  var updatedData = {
    title: this.$('[data-title]').text(),
    description: this.$('[data-description]').text()
  };

  Meteor.call('fragmentUpdate', this.data._id, updatedData);
};

Template.fragmentItem.events({
  'click .wrapper': function (event) {
    var instance = Template.instance();

    event.preventDefault();

    if (instance.isEditing.get()) {
      return;
    }

    instance.isEditing.set(true);
    Session.set('modal', true);
  },
  'click [data-delete]': function (event) {
    event.preventDefault();
    Session.set('modal', false);

    Meteor.call('fragmentDelete', Template.instance().data._id);
  }
});