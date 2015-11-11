UI.setAutofocus = function (template, sessionKey) {
  template.events({
    'click': function (event) {
      event.stopPropagation();
    }
  });

  template.onRendered(function () {
    $('body').on('click', Template.instance(), onBlur);
  });

  template.onDestroyed(function () {
    $('body').off('click', onBlur);
  });

  function onBlur (event) {
    event.preventDefault();
    event.stopPropagation();
    Session.set(sessionKey, false);
  }
}