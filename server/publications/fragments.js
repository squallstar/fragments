Meteor.publish('fragments', function (options) {
  check(options, {
    _id: Match.Optional(String),
    sort: Match.Optional(Object),
    limit: Match.Optional(Number),
    text: Match.Optional(String),
    tag: Match.Optional(String),
    collection: Match.Optional(String),
    favourited: Match.Optional(Boolean),
    userId: Match.Optional(String)
  });

  // When in search mode, we remove all local fragments
  if (options.limit === 0) {
    return this.stop();
  }

  var query = {},
      collections;

  if (options.text) {
    let result = AdvancedQueries.ParseTextQuery(options.text);

    if (result) {
      query = _.extend(query, result);
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

    collections = Collections.find({
      $or: [
        { user: this.userId },
        { 'collaborators._id': this.userId }
      ]
    }, {
      collaborators: 1, is_hidden: 1
    }).fetch();

    if (collections.length) {
      // Don't filter by "not hidden" when it's a filter by a collaborator or tag or text
      // to max out the results
      let filteredCollections = options.userId || options.tag || options.text
        ? collections
        : _.reject(collections, (c) => { return c.is_hidden === true; });

      let collectionsIds = filteredCollections.map((c) => { return c._id; });

      if (collectionsIds.length) {
        query['collections._id'] = { $in: collectionsIds };
      }
    }

    if (!query['collections._id']) {
      query['user._id'] = this.userId;
    }
  }

  if (options.tag) {
    query.tags = options.tag;
  }

  if (options.userId && query['collections._id']) {
    query['user._id'] = options.userId;
  }

  if (options.favourited) {
    query.pinned_at = { $ne: null };
  }

  if (typeof query['collections._id'] === 'object') {
    let textQuery = query.$text;

    const textOmittedQuery = _.omit(query, ['$text']);

    if (options.userId && query['user._id'] === options.userId) {
      query = { $or: [textOmittedQuery] };
    } else {
      query = {
        $or: [
          _.extend(_.omit(query, ['collections._id', '$text']), { 'user._id': this.userId }),
          textOmittedQuery
        ]
      };
    }

    if (textQuery) {
      query.$text = textQuery;
    } else if (collections.length && !options.userId) {
      let hiddenCollectionsIds = _
        .filter(collections, (c) => { return c.is_hidden === true; })
        .map((c) => { return c._id; });

      if (hiddenCollectionsIds.length) {
        query.$or[0]['collections._id'] = { $nin: hiddenCollectionsIds };
      }
    }
  }

  if (!query.$text && query.$or) {
    query.$or.forEach(($or) => {
      $or['archived'] = { $ne: this.userId };
    });
  }

  // enable for debugging
  // console.log('PUBLICATIONS:FRAGMENTS', JSON.stringify({ options, query }));

  Counts.publish(this, 'fragmentsCount', Fragments.find(query));

  return Fragments.find(query, {
    sort: options.sort,
    limit: options.limit
  });
});