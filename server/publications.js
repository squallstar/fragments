Meteor.publish('fragments', function (options) {
  check(options, {
    sort: Match.Optional(Object),
    limit: Match.Optional(Number),
    text: Match.Optional(String),
    tag: Match.Optional(String)
  });

  var query = {
    user: this.userId
  };

  if (options.text) {
    query.$text = { $search: options.text };
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