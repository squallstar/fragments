// Constants
const USER_MIN_PASSWORD_LENGTH = 6;

// UI Hooks
UI.setErrors(Template.register);

Template.register.events({
  'submit form' : function (event, template) {
    event.preventDefault();

    var name = template.$('input[name="name"]').val().trim(),
        email = template.$('input[type="email"]').val().trim(),
        password = template.$('input[name="password"]').val(),
        confirmPassword = template.$('input[name="confirm_password"]').val();

    if (!name) {
      return Notifications.error('Your name is required');
    }

    if (!email) {
      return Notifications.error('Your email address is required');
    }

    if (!password) {
      return Notifications.error('You have to choose a password.');
    }

    if (password.length < USER_MIN_PASSWORD_LENGTH) {
      return Notifications.error('Your new password should be at least ' + USER_MIN_PASSWORD_LENGTH + ' chatacters.');
    }

    if (password !== confirmPassword) {
      return Notifications.error('The passwords confirmation does not match the password you have chosen.');
    }

    Accounts.createUser({
      profile: {
        name: name
      },
      email: email,
      password : password
    }, function (err) {
      if (err) {
        switch (err.error) {
          default:
            return Notifications.error(err.reason);
        }
      }

      Router.go('home');
    });
  }
});