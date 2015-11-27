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
    _.each(options.text.split(' '), (piece) => {
      let result = piece.match(/([A-z]+):([A-z0-9\-]+)/),
          handled = false;

      if (!result || result.length < 3) {
        return;
      }

      let [ input, action, value ] = result;

      switch (action) {
        case 'from':
        case 'to':
        case 'when':
          let date, dayStartTs, dayEndTs;

          // Create date range
          switch (value) {
            case 'today': date = moment(); break;
            case 'yesterday': date = moment().subtract(1, 'days'); break;
            default: date = moment(value, 'DD-MM-YYYY');
          }

          // Converts range to timestamps
          dayStartTs = Number(date.startOf('day').format('x'));
          dayEndTs = Number(date.endOf('day').format('x'));

          query.created_at = {};

          // Sets "from" range
          if (action === 'from' || action === 'when') {
            query.created_at.$gte = dayStartTs;
          }

          // Sets "up to" range
          if (action === 'to' || action === 'when') {
            query.created_at.$lte = dayStartTs;
          }

          handled = true;
      }

      if (handled) {
        options.text = options.text.replace(input, '');
      }
    });

    options.text = options.text.trim();
    if (options.text.length) {
      query.$text = { $search: options.text };
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