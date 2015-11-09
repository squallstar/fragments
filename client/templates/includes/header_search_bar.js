Template.header_search_bar.helpers({
  currentSearch: function () {
    return Session.get(CURRENT_SEARCH_KEY);
  },
  currentTag: function () {
    return Session.get(CURRENT_TAG_KEY);
  }
});

Template.header_search_bar.events({
  'focus input': function () {
    if (Router.current().route.getName() !== 'search') {
      Router.go('search');
      Template.instance().$('input').select();
    }
  },
  'keyup input': function (event) {
    if (event.keyCode !== 13) {
      return;
    }

    var instance = Template.instance(),
        $field = instance.$('input'),
        query = $field.val();

    if (!query) {
      return Router.go('/');
    }

    Router.go('searchResults', {
      text: query
    });
  },
  'click [data-remove-tag]': function () {
    Session.set(CURRENT_TAG_KEY, undefined);
  }
});