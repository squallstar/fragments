Meteor.methods({
  createTutorial: function (user) {
    check(user, Object);
    check(user._id, String);
    check(user.profile, Object);
    check(user.profile.name, String);

    Fragments.insert({
      user: user._id,
      fetched_at: Date.now(),
      title: 'Hey ' + user.profile.name.split(' ')[0] + '!',
      description: 'Welcome to Fragments! This is your very first fragment, displayed here as a tutorial card. To dismiss it, click here and find the cross icon in the top right of the card.',
      images: [
        { url: '/assets/img/tutorial/welcome.png' } /* Temporary asset */
      ],
      tags: ['Tutorial', 'Welcome']
    });

    SearchHistory.insert({
      user: user._id,
      query: 'tutorial'
    })
  }
});