var isValidPassword = function (val) {
  return val.length >= 6;
}

Template.register.events({
  'submit form' : function (event, template) {
    event.preventDefault();

    var email = template.$('input[type="email"]').val().trim(),
        password = template.$('input[name="password"]').val(),
        confirmPassword = template.$('input[name="confirm_password"]').val();

    if (!isValidPassword(password)) {
      return console.log('password too short');
    }

    if (password !== confirmPassword) {
      return console.log('passwords confirmation does not match password');
    }

    Accounts.createUser({
      email: email,
      password : password
    }, function (err) {
      if (err) {
        return console.log('err');
      }

      Router.go('login');
    });
  }
});