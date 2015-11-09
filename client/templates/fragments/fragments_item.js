Template.fragmentItem.helpers({
  isFetching: function () {
    return this.fetched_at === null;
  },
  isEditing: function () {
    return Template.instance().isEditing.get();
  },
  isAddingTag: function () {
    return Template.instance().isAddingTag.get();
  }
});

Template.fragmentItem.onCreated(function () {
  this.isEditing = new ReactiveVar(false);
  this.isAddingTag = new ReactiveVar(false);
});

Template.fragmentItem.onRendered(function () {
  this.autorun(() => {
    if (this.isEditing.get() && !Session.get('modal')) {
      this.isEditing.set(false);
      this.isAddingTag.set(false);
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
  'click .link': function (event) {
    event.stopPropagation();
  },
  'click .wrapper': function (event) {
    var instance = Template.instance();

    event.preventDefault();

    if (instance.isEditing.get()) {
      return;
    }

    instance.isEditing.set(true);
    Session.set('modal', true);
  },
  'keydown [data-save-on-return]': function (event) {
    if ([13].indexOf(event.keyCode) !== -1) {
      event.preventDefault();
      Session.set('modal', false);
    }
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
  },
  'click [data-add-tag]': function (event) {
    var instance = Template.instance();
    event.preventDefault();
    instance.isAddingTag.set(true);
    setTimeout(function () {
      instance.$('[data-new-tag]').focus();
    }, 10);
  },
  'click .tag.can-be-removed': function (event) {
    event.preventDefault();
    var tag = $(event.currentTarget).data('value');
    var fragmentId = Template.instance().data._id;

    Meteor.call('fragmentApplyChanges', fragmentId, 'pull', 'tags', tag);
  },
  'click [data-new-tag]': function (event) {
    document.execCommand('selectAll', false, null);
  },
  'keydown [data-new-tag], blur [data-new-tag]': function (event) {
    if (event.keyCode && [9, 13, 188].indexOf(event.keyCode) === -1) {
      return;
    }

    event.preventDefault();

    var instance = Template.instance(),
        $field = instance.$('[data-new-tag]'),
        tag = $field.text();

    if (!tag) {
      Template.instance().isAddingTag.set(false);
      return;
    }

    var fragmentId = instance.data._id;

    Meteor.call('fragmentApplyChanges', fragmentId, 'addToSet', 'tags', tag, function () {
      if (event.keyCode) {
        $field.text('');
      } else {
        // This happens when the action was triggered by the "blur" event
        instance.isAddingTag.set(false);
      }
    });
  }
});