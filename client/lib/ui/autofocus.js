UI.setAutofocus = function (template, options) {
  options = options || {};

  if (!options.sessionKey) {
    throw new Error('Session key not given for auto focus');
  }

  template.events({
    'click': function (event) {
      var href = $(event.currentTarget).attr('href');
      if (href && href.substr(0,1) === '/') {
        Session.set(options.sessionKey, false);
        Router.go(href);
      } else {
        event.stopPropagation();
      }
    }
  });

  template.onRendered(function () {
    $('body').on('click', Template.instance(), onBlur);

    if (options.modal) {
      Session.set(MODAL_VISIBLE_KEY, true);
    }
  });

  template.onDestroyed(function () {
    $('body').off('click', onBlur);
  });

  function onBlur (event) {
    Session.set(options.sessionKey, false);

    if (options.modal) {
      Session.set(MODAL_VISIBLE_KEY, false);
    }
  }
}