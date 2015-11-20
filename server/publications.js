Meteor.publish('fragments', function (options) {
  check(options, {
    sort: Match.Optional(Object),
    limit: Match.Optional(Number),
    text: Match.Optional(String),
    tag: Match.Optional(String),
    collection: Match.Optional(String)
  });

  var query = {};

  if (options.text) {
    query.$text = { $search: options.text };
  }

  if (options.collection) {
    query['collections._id'] = options.collection;
  } else {
    check(this.userId, String);
    query.user = this.userId;

    let collectionsIds = Collections
      .find({ user: this.userId, hide_from_dashboard: true })
      .map(function (collection) { return collection._id });

    if (collectionsIds.length) {
      query['collections._id'] = { $nin: collectionsIds };
    }
  }

  if (options.tag) {
    query.tags = options.tag;
  }

  return Fragments.find(query, {
    sort: options.sort,
    limit: options.limit
  });
});

Meteor.publish('searchHistory', function (options) {
  options = options || {};

  check(options, {
    limit: Match.Optional(Number)
  });

  options.sort = { created_at: -1 };

  if (!options.limit || options.limit > 50) {
    options.limit = 7;
  }

  return SearchHistory.find({ user: this.userId }, options);
});

Meteor.publish('collections', function () {
  return Collections.find({ user: this.userId });
});

Meteor.publish('collection', function (id) {
  check(id, String);
  return Collections.find(id);
});