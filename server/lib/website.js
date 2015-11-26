// Compile website templates
SSR.compileTemplate('websiteLayout', Assets.getText('website/layout.html'));
SSR.compileTemplate('websiteIndex', Assets.getText('website/index.html'));

// Website layout helpers
Template.websiteLayout.helpers({
  getDocType: function() {
    return '<!DOCTYPE html>';
  }
});

// Meteor.startup(function () {
//   var websiteIndex = SSR.render('emailLayout', { template: 'websiteIndex' });
// });

// console.log('compiling');
// console.log(websiteIndex);

Meteor.Website = {
  index: () => {
    return SSR.render('websiteLayout', { template: 'websiteIndex', data: { } });
  }
};