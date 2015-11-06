Template.header_user_tooltip.events({
  'click': function (event) {
    event.stopPropagation();
  }
});

Template.header_user_tooltip.onRendered(function () {
  $('body').on('click', Template.instance(), onBlur);
});

Template.header_user_tooltip.onDestroyed(function () {
  $('body').off('click', onBlur);
});

function onBlur (event, instance) {
  event.preventDefault();
  event.stopPropagation();
  Session.set(USER_TOOLTIP_KEY, false);
}