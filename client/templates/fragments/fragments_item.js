Template.fragmentItem.helpers({
  isFetching: function () {
    return this.fetched_at === null;
  },
  isEditing: function () {
    return Template.instance().isEditing.get();
  },
  isAddingTag: function () {
    return Template.instance().isAddingTag.get();
  },
  currentTag: function () {
    return Session.get(CURRENT_TAG_KEY);
  }
});

Template.fragmentItem.onCreated(function () {
  this.isEditing = new ReactiveVar(false);
  this.isAddingTag = new ReactiveVar(false);
});

Template.fragmentItem.onRendered(function () {
  this.autorun(() => {
    if (this.isEditing.get() && !Session.get(MODAL_VISIBLE_KEY)) {
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
  'click [data-edit]': function (event) {
    var instance = Template.instance();

    event.preventDefault();

    if (instance.isEditing.get()) {
      return;
    }

    instance.isEditing.set(true);
    Session.set(MODAL_VISIBLE_KEY, true);
  },
  'keydown [data-save-on-return]': function (event) {
    if ([13].indexOf(event.keyCode) !== -1) {
      event.preventDefault();
      Session.set(MODAL_VISIBLE_KEY, false);
    }
  },
  'click [data-delete]': function (event) {
    event.preventDefault();
    event.stopPropagation();
    Session.set(MODAL_VISIBLE_KEY, false);

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
  'click .tag': function (event, template) {
    if (template.isEditing.get()) {
      return;
    }

    var currentTag = Session.get(CURRENT_TAG_KEY),
        tag = $(event.target).text();

    Session.set(CURRENT_TAG_KEY, currentTag !== tag ? tag : undefined);
  },
  'click .tag.can-be-removed': function (event) {
    event.preventDefault();
    event.stopPropagation();
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
  },
  'click .collections .name': function (event) {
    event.preventDefault();
    event.stopPropagation();
  },
  'click .date': function (event) {
    event.preventDefault();
    var createdAt = moment(this.created_at),
        query;

    if (createdAt.isSame(moment(), 'day')) {
      query = 'today';
    } else if (createdAt.isSame(moment().subtract(1, 'days'), 'day')) {
      query = 'yesterday';
    } else {
      query = createdAt.format('DD-MM-YYYY');
    }

    Router.go('searchResults', {
      text: 'when:' + query
    });
  }
});