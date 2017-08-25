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
        collection = Session.get(CURRENT_COLLECTION_KEY),
        options = {
          sort: { pinned_at: -1, created_at: -1 },
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

    if (tag) {
      options.tag = tag;
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