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
        case 'when':
          let date;

          switch (value) {
            case 'today': date = moment(); break;
            case 'yesterday': date = moment().subtract(1, 'days'); break;
            default: date = moment(value, 'DD-MM-YYYY');
          }

          query.created_at = {
            $lte: date.endOf('day').format('x'),
            $gte: date.startOf('day').format('x')
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