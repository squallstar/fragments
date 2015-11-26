Template.fragmentSubmit.onCreated(function() {
  this.isNote = new ReactiveVar(false);
  Session.set('fragmentSubmitErrors', {});
});

Template.fragmentSubmit.onRendered(function () {
  if (!Meteor.isTouch) {
    this.$('input').focus();
  }
});

Template.fragmentSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('fragmentSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('fragmentSubmitErrors')[field] ? 'has-error' : '';
  },
  currentTag: function () {
    return Session.get(CURRENT_TAG_KEY);
  },
  currentCollection: function () {
    return Session.get(CURRENT_COLLECTION_KEY);
  },
  isNote: function () {
    return Template.instance().isNote.get();
  }
});

Template.fragmentSubmit.events({
  'keyup input': function (event, template) {
    var text = $(event.target).val();
    template.isNote.set(text.indexOf(' ') !== -1);
  },
  'submit form': function (event, template) {
    event.preventDefault();

    var $url = $(event.target).find('[name=url]');

    var fragment = {
      url: $url.val()
    };

    var currentTag = Session.get(CURRENT_TAG_KEY);
    if (currentTag) {
      fragment.tags = [currentTag];
    }

    var currentCollection = Session.get(CURRENT_COLLECTION_KEY);
    if (currentCollection) {
      fragment.collections = [currentCollection];
    }

    var errors = {};
    if (!fragment.url) {
      errors.url = "Please type a url";
      return Session.set('fragmentSubmitErrors', errors);
    }

    $url.val('');

    Meteor.call('fragmentInsert', fragment, function (error, fragmentId) {
      if (error) {
        Notifications.error(error.reason);
      }
    });
  }
});