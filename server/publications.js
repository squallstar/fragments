Meteor.publish('fragments', function (options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Fragments.find({ user: this.userId }, options);
});

Meteor.publish('searchHistory', function (options) {
  options = options || {};

  check(options, {
    limit: Match.Optional(Number)
  });

  return SearchHistory.find({ user: this.userId }, options);
});