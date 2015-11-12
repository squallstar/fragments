// UI Hooks
UI.setErrors(Template.login);

Template.login.events({
  'submit form': function (event, template) {
    event.preventDefault();

    var email = template.$('input[type="email"]').val().trim(),
        password = template.$('input[type="password"]').val();

    if (!email || !password) {
      return;
    }

    Meteor.loginWithPassword(email, password, function (err) {
      if (err) {
        switch (err.error) {
          case 403:
            return template.error.set('We don’t seem to recognise your details. Either your email or password are incorrect. Please try again.');
          default:
            return template.error.set(err.reason);
        }
      }

      Router.go('home');
    });
  },
  'click a[data-google]': function (event, template) {
    event.preventDefault();

    Meteor.loginWithGoogle({
      requestPermissions: ['email']
    }, function (err) {
      if (err) {
        console.log('err', err);
      }
    });
  }
});