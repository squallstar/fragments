Meteor.publish('fragmentComments', function (fragmentId) {
  check(fragmentId, String);

  return Comments.find({
    fragment: fragmentId
  });
});