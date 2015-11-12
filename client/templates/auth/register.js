// Constants
const USER_MIN_PASSWORD_LENGTH = 6;

// UI Hooks
UI.setErrors(Template.register);

Template.register.events({
  'submit form' : function (event, template) {
    event.preventDefault();

    var email = template.$('input[type="email"]').val().trim(),
        password = template.$('input[name="password"]').val(),
        confirmPassword = template.$('input[name="confirm_password"]').val();

    if (!password) {
      return template.error.set('Password is required.');
    }

    if (password.length < USER_MIN_PASSWORD_LENGTH) {
      return template.error.set('Password should be at least ' + USER_MIN_PASSWORD_LENGTH + ' chatacters.');
    }

    if (password !== confirmPassword) {
      return template.error.set('Passwords confirmation does not match the password.');
    }

    Accounts.createUser({
      email: email,
      password : password
    }, function (err) {
      if (err) {
        switch (err.error) {
          default:
            return template.error.set(err.reason);
        }
      }

      Router.go('home');
    });
  }
});