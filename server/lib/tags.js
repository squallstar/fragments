Meteor.methods({
  'getTags': function () {
    return Fragments.aggregate([
      { $match: { user: this.userId } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 100 }
    ]);
  }
});