// Compile email templates
SSR.compileTemplate('emailLayout', Assets.getText('emails/layout.html'));
SSR.compileTemplate('verifyEmail', Assets.getText('emails/verify-email.html'));
SSR.compileTemplate('resetPassword', Assets.getText('emails/reset-password.html'));

// Email base layout helpers
Template.emailLayout.helpers({
  getDocType: function() {
    return '<!DOCTYPE html>';
  }
});

// Grab email CSS
const templateCss = Assets.getText('emails/style.css');

Meteor.renderEmail = function (templateName, data) {
  return SSR.render('emailLayout', {
    css: templateCss,
    template: templateName,
    data: data
  });
};