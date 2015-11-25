Meteor.startup(function() {
  // Email SMTP setup
  if (Meteor.settings.emailSmtpUrl) {
    process.env.MAIL_URL = Meteor.settings.emailSmtpUrl;
  }

  // Default settings for outgoing emails
  Accounts.emailTemplates.from = 'no-reply@fragments.me';
  Accounts.emailTemplates.sitename = 'Fragments.me';

  // Default settings for the accounts
  Accounts.config({
    sendVerificationEmail: true
  });

  Accounts.emailTemplates.verifyEmail.subject = function (user) {
    return 'Please confirm your Email address';
  };

  Accounts.emailTemplates.verifyEmail.html = function (user, url) {
    return Meteor.renderEmail('verifyEmail', {
      name: user.profile.name,
      url: url
    });
  };

  // Overrides the verify email url
  Accounts.urls.verifyEmail = function (token) {
    return Router.url('verify_email', { token: token });
  };

  Accounts.emailTemplates.resetPassword.subject = function (user) {
    return 'Reset your Password';
  };

  Accounts.emailTemplates.resetPassword.html = function (user, url) {
    return Meteor.renderEmail('resetPassword', {
      name: user.profile.name,
      url: url
    });
  };

  // Overrides the reset password url
  Accounts.urls.resetPassword = function (token) {
    return Router.url('reset_password', { token: token });
  };
});