const KEY_PASSWORD_TOKEN = 'resetPasswordToken';
const KEY_PASSWORD_EMAIL = 'resetPasswordEmailSent';

Template.reset_password.helpers({
  token: function () {
    return Template.instance().token.get();
  },
  emailHasBeenSent: function () {
    return Template.instance().emailHasBeenSent.get();
  }
});

Template.reset_password.onCreated(function () {
  this.token = new ReactiveVar(false);
  this.emailHasBeenSent = new ReactiveVar(false);

  if (Accounts._resetPasswordToken) {
    this.token.set(Accounts._resetPasswordToken);
  }
});

Template.reset_password.events({
  'submit form' : function (event, template) {
    event.preventDefault();

    var email = template.$('input[type="email"]').val().trim();
    var emailHasBeenSent = Template.instance().emailHasBeenSent;

    Accounts.forgotPassword({ email: email }, function (err) {
      if (err) {
        return console.log('err');
      }

      emailHasBeenSent.set(true);
    });
  }
});