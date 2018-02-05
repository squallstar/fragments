Meteor.methods({
  shareFragment: function (fragmentId, recipient, message) {
    check(fragmentId, String);
    check(recipient, String);
    check(message, String);

    var fragment = Fragments.findOne(fragmentId);
    var user = Meteor.users.findOne(fragment.user._id);

    this.unblock();

    Email.send({
      from: 'no-reply@fragments.me',
      to: recipient,
      subject: fragment.title,
      html: Meteor.renderEmail('shareFragment', {
        from: user.profile.name,
        title: fragment.title,
        description: fragment.description,
        message: message,
        url: fragment.url,
        image: fragment.lead_image
      })
    })
  }
});