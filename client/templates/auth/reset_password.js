Template.reset_password.helpers({
  emailHasBeenSent: function () {
    return Template.instance().emailHasBeenSent.get();
  },
  passwordHasBeenReset: function () {
    return Template.instance().passwordHasBeenReset.get();
  }
});

Template.reset_password.onCreated(function () {
  this.emailHasBeenSent = new ReactiveVar(false);
  this.passwordHasBeenReset = new ReactiveVar(false);
});

Template.reset_password.events({
  'submit form[name="reset_password"]' : function (event, template) {
    event.preventDefault();

    var email = template.$('input[type="email"]').val().trim();
    var emailHasBeenSent = Template.instance().emailHasBeenSent;

    Accounts.forgotPassword({ email: email }, function (err) {
      if (err) {
        return console.log('err');
      }

      emailHasBeenSent.set(true);
    });
  },
  'submit form[name="new_password"]' : function (event, template) {
    event.preventDefault();

    var password = template.$('input[type="password"]').val();

    Accounts.resetPassword(template.data.token, password, (err) => {
      if (err) {
        return console.log('err', err);
      }

      template.passwordHasBeenReset.set(true);
    });
  }
});