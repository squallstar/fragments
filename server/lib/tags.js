Meteor.methods({
  'getTags': function () {
    return Fragments.aggregate([
      { $match: { user: this.userId } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { sum: -1 } },
      { $limit: 50 },
      { $sort: { _id: 1 } }
    ]);
  }
});