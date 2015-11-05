Meteor.publish('fragments', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Fragments.find({ user: this.userId }, options);
});