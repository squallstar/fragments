// Grab email CSS
const TEMPLATE_CSS = Assets.getText('emails/style.css');

// Compile email templates
SSR.compileTemplate('emailLayout', Assets.getText('emails/layout.html'));
SSR.compileTemplate('verifyEmail', Assets.getText('emails/verify-email.html'));
SSR.compileTemplate('resetPassword', Assets.getText('emails/reset-password.html'));
SSR.compileTemplate('shareFragment', Assets.getText('emails/share-fragment.html'));

// Email base layout helpers
Template.emailLayout.helpers({
  getDocType: function() {
    return '<!DOCTYPE html>';
  }
});

Meteor.renderEmail = function (templateName, data) {
  return SSR.render('emailLayout', {
    css: TEMPLATE_CSS,
    template: templateName,
    data: data
  });
};