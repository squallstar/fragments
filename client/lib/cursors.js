Cursors = {};

Cursors.fragments = function () {
  if (!Cursors.__fragments) {
    setupFragmentsCursor();
  }

  return Cursors.__fragments;
};

setupFragmentsCursor = function () {
  Session.set(CURRENT_LIMIT_KEY, PAGE_SIZE);

  Deps.autorun(function () {
    var limit = Session.get(CURRENT_LIMIT_KEY),
        textQuery = Session.get(CURRENT_SEARCH_KEY),
        tag = Session.get(CURRENT_TAG_KEY),
        collaborator = Session.get(CURRENT_COLLABORATOR_KEY),
        collection = Session.get(CURRENT_COLLECTION_KEY),
        options = {
          sort: { created_at: -1 },
          limit: limit
        };

    if (textQuery) {
      options.text = textQuery;
    }

    if (collection) {
      options.collection = collection._id;
    } else if (!Meteor.userId()) {
      return;
    }

    if (Session.get(FAVOURITES_ONLY)) {
      options.favourited = true;
      options.sort = { pinned_at: -1 };
    }

    if (tag) {
      options.tag = tag;
    }

    if (collaborator) {
      collaborator = collaborator.match(/data-collaborator="(.+)"/, '');
      if (collaborator && collaborator.length > 1) {
        options.userId = collaborator[1];
      }
    }

    Session.set(APP_BUSY_KEY, true);

    // subscribe to the posts publication
    Cursors.__fragments = Meteor.subscribe('fragments', options);

    // if subscription is ready, set limit to newLimit
    if (Cursors.__fragments.ready()) {
      Session.set(APP_BUSY_KEY, false);
    }
  });
};