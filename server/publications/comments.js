Meteor.publish('fragmentComments', function (fragmentId) {
  check(this.userId, String);
  check(fragmentId, String);

  return Comments.find({
    fragment: fragmentId
  });
});