Meteor.methods({
  getTags: function (options) {
    check(this.userId, String);
    check(options, {
      collection: Match.Optional(String)
    });

    var query = {
      user: this.userId
    };

    if (options.collection) {
      query['collections._id'] = options.collection;
    }

    return Fragments.aggregate([
      { $match: query },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { sum: -1 } },
      { $limit: 50 }
      // { $sort: { _id: 1 } }
    ]);
  }
});