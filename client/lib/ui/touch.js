Meteor.startup(function () {
  if ('ontouchstart' in window) {
    $('html').addClass('is-touch');
  }
});