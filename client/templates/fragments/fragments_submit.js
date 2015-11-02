Template.fragmentSubmit.onCreated(function() {
  Session.set('fragmentSubmitErrors', {});
});

Template.fragmentSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('fragmentSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('fragmentSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.fragmentSubmit.events({
  'submit form': function (event, template) {
    event.preventDefault();

    var $url = $(event.target).find('[name=url]');

    var fragment = {
      url: $url.val(),
    };

    var errors = {};
    if (! fragment.url) {
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