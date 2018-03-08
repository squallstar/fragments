var searchRouteName = 'search';

Template.headerSearchBar.helpers({
  currentSearch: function () {
    return Session.get(CURRENT_SEARCH_KEY);
  },
  currentTag: function () {
    return Session.get(CURRENT_TAG_KEY);
  },
  currentCollaborator: function () {
    return Session.get(CURRENT_COLLABORATOR_KEY);
  },
  currentCollection: function () {
    return Session.get(CURRENT_COLLECTION_KEY);
  },
  searchBarPlaceholder: function () {
    var collection = Session.get(CURRENT_COLLECTION_KEY);

    if (!collection) {
      return 'Search';
    }

    if (collection.user !== Meteor.userId()) {
      return 'Search this shared collection';
    }

    return 'Search this collection';
  }
});

Template.headerSearchBar.events({
  'focus input': function () {
    if (Router.current().route.getName() !== searchRouteName) {
      Router.go(searchRouteName);
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
      return Router.goToRelevant();
    }

    $field.blur();

    Router.go('searchResults', {
      text: query
    });
  },
  'click [data-remove-tag]': function (event) {
    event.preventDefault();
    Session.set(CURRENT_TAG_KEY, undefined);
  },
  'click [data-remove-collaborator]': function (event) {
    event.preventDefault();
    Session.set(CURRENT_COLLABORATOR_KEY, undefined);
  },
  'click [data-clear-search]': function (event) {
    event.preventDefault();

    //Template.instance().$('input').val('');
    Session.set(CURRENT_SEARCH_KEY, undefined);

    Router.goToRelevant();
  }
});