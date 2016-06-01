Meteor.methods({
  getTags: function (options) {
    check(this.userId, String);
    check(options, {
      collection: Match.Optional(String)
    });

    var query = {};

    if (options.collection) {
      query['collections._id'] = options.collection;
    } else {
      let collections = Collections.find({
        'collaborators._id': this.userId
      }, {
        collaborators: 1
      }).fetch();

      query.$or = [ { 'user._id': this.userId } ];

      if (collections.length) {
        query.$or.push({ 'collections._id': { $in: _.map(collections, (c) => { return c._id; }) } });
      }
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