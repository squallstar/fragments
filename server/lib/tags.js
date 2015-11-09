Meteor.methods({
  'getTags': function () {
    return Fragments.aggregate([
      { $match: { user: this.userId } },
      { $unwind: '$entities' },
      { $group: { _id: '$entities', number: { $sum: 1 } } },
      { $sort: { number: -1 } },
      { $limit: 100 }
    ]);
  }
});