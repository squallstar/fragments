Meteor.publish('fragments', function (options) {
  check(options, {
    _id: Match.Optional(String),
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

  if (options._id) {
    query['_id'] = options._id;
  }

  if (options.collection) {
    query['collections._id'] = options.collection;
  } else {
    if (!this.userId) {
      return this.stop();
    }

    check(this.userId, String);

    let collections = Collections.find({
      $or: [
        { user: this.userId },
        { 'collaborators._id': this.userId }
      ]
    }, {
      collaborators: 1, is_hidden: 1
    }).fetch();

    if (collections.length) {
      let collectionsIds = _
        .reject(collections, (c) => { return c.is_hidden === true; })
        .map((c) => { return c._id; });

      if (collectionsIds.length) {
        query['collections._id'] = { $in: collectionsIds };
      }
    }

    if (!query['collections._id']) {
      query.user = this.userId;
    }
  }

  if (options.tag) {
    query.tags = options.tag;
  }

  if (typeof query['collections._id'] === 'object') {
    let textQuery = query.$text;

    query = {
      $or: [
        _.extend(_.omit(query, ['collections._id', '$text']), { 'user._id': this.userId }),
        _.omit(query, ['$text'])
      ]
    };

    if (textQuery) {
      query.$text = textQuery;
    }
  }

  return Fragments.find(query, {
    sort: options.sort,
    limit: options.limit
  });
});