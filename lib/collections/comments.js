// Collection
Comments = new Mongo.Collection('Comments');

// Hooks to be triggered before insert
Comments.before.insert(function (userId, comment) {
  comment.created_at = Date.now();
});

Comments.after.insert(function (userId, comment) {
  Fragments.update(comment.fragment, {
    $inc: {
      commentsCount: 1
    }
  });
});

Meteor.methods({
  addFragmentComment: function (fragmentId, text) {
    var user = Meteor.user();

    check(user, Object);
    check(fragmentId, String);
    check(text, String);

    if (!text) {
      throw new Meteor.Error(400, 'Text is required');
    }

    // Strip tags
    text = text.replace(/(<([^>]+)>)/ig, '');

    return Comments.insert({
      fragment: fragmentId,
      user: {
        _id: user._id,
        name: user.profile.name,
        picture: user.profile.picture
      },
      text: text
    });
  }
})