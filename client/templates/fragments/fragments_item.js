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

    var fragmentId = Template.instance().data._id;

    // Wait for events to pop before destroying this item
    // https://github.com/meteor/meteor/issues/2981
    setTimeout(() => {
      Meteor.call('fragmentDelete', fragmentId);
    }, 0);
  },
  'click [data-next-thumbnail]': function (event) {
    event.preventDefault();

    var instance = Template.instance(),
        images = instance.data.images,
        fragmentId = instance.data._id;

    for (var i = 0, len = instance.data.images.length; i < len; i++) {
      if (instance.data.lead_image === images[i].url) {
        return Meteor.call('fragmentUpdate', fragmentId, {
          lead_image: images[i+1 < len? i+1 : 0].url
        });
      }
    }
  },
  'click [data-remove-thumbnail]': function (event) {
    event.preventDefault();

    var fragmentId = Template.instance().data._id;

    Template.instance().$('.images').slideUp(300, function () {
      Meteor.call('fragmentUpdate', fragmentId, {
        lead_image: null,
        images: []
      });
    });
  }
});