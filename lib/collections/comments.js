// Collection
Comments = new Mongo.Collection('Comments');

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

    Fragments.update(fragmentId, {
      $inc: {
        commentsCount: 1
      }
    });

    return Comments.insert({
      created_at: Date.now(),
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