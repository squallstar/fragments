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

    if (!email) {
      return Notification.error('You must type an email address');
    }

    var emailHasBeenSent = Template.instance().emailHasBeenSent;

    Accounts.forgotPassword({ email: email }, function (err) {
      if (err) {
        let message;

        switch (err.error) {
          case 403:
            message = 'The email address has not been found';
            break;
          default:
            message = err.reason;
        }

        return Notification.error(message);
      }

      emailHasBeenSent.set(true);
    });
  },
  'submit form[name="new_password"]' : function (event, template) {
    event.preventDefault();

    var password = template.$('input[type="password"]').val();

    if (!password) {
      return Notification.error('You must type your new password');
    }

    Accounts.resetPassword(template.data.token, password, (err) => {
      if (err) {
        return Notification.error(err.reason || err.message);
      }

      Notification.success('Your password has been updated');

      template.passwordHasBeenReset.set(true);
    });
  }
});