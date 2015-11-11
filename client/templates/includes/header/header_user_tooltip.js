Template.headerUserTooltip.events({
  'click': function (event) {
    event.stopPropagation();
  }
});

Template.headerUserTooltip.onRendered(function () {
  $('body').on('click', Template.instance(), onBlur);
});

Template.headerUserTooltip.onDestroyed(function () {
  $('body').off('click', onBlur);
});

function onBlur (event, instance) {
  event.preventDefault();
  event.stopPropagation();
  Session.set(USER_TOOLTIP_KEY, false);
}