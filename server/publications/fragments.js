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
    let textQuery = AdvancedQueries.ParseTextQuery(options.text);

    if (textQuery) {
      query = _.extend(query, textQuery);
    }
  }

  if (options.collection) {
    query['collections._id'] = options.collection;
  } else {
    if (!this.userId) {
      return this.stop();
    }

    check(this.userId, String);
    query.user = this.userId;

    let collectionsIds = Collections
      .find({ user: this.userId, is_hidden: true })
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