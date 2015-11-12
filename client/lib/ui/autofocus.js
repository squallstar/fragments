UI.setAutofocus = function (template, sessionKey) {
  template.events({
    'click': function (event) {
      event.preventDefault();
      event.stopPropagation();

      var href = $(event.currentTarget).attr('href');
      if (href && href.substr(0,1) === '/') {
        Router.go(href);
      }
    }
  });

  template.onRendered(function () {
    $('body').on('click', Template.instance(), onBlur);
  });

  template.onDestroyed(function () {
    $('body').off('click', onBlur);
  });

  function onBlur (event) {
    Session.set(sessionKey, false);
  }
}