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
    }
  });
});

Template.fragmentItem.events({
  'click .wrapper' : function (event) {
    var instance = Template.instance();

    event.preventDefault();

    if (instance.isEditing.get()) {
      return;
    }

    instance.isEditing.set(true);
    Session.set('modal', true);
  }
});