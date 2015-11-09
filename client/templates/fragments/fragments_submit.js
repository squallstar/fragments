Template.fragmentSubmit.onCreated(function() {
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
  }
});

Template.fragmentSubmit.events({
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

    var errors = {};
    if (!fragment.url) {
      errors.url = "Please type a url";
      return Session.set('fragmentSubmitErrors', errors);
    }

    $url.val('');

    Meteor.call('fragmentInsert', fragment, function (error, fragmentId) {
      if (error) {
        console.error(error.reason);
      }
    });
  }
});