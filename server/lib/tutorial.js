Meteor.methods({
  createTutorial: function (user) {
    check(user, Object);
    check(user._id, String);
    check(user.profile, Object);
    check(user.profile.name, Match.OneOf(String, undefined));

    var displayName = user.profile.name ? user.profile.name.split(' ')[0] : '';

    function insertFragment (data) {
      Fragments.insert({
        user: user._id,
        fetched_at: Date.now(),
        title: data.title,
        description: data.description,
        images: [ { url: data.image } ],
        tags: data.tags,
        collections: data.collections
      });
    }

    var stuffCollection = Collections.shrink(
      Collections.findOne(
        Meteor.call('collectionInsert', {
          user: user._id,
          name: 'Stuff',
          color: '#ff9e9d'
        })
      )
    );

    var interestingCollection = Collections.shrink(
      Collections.findOne(
        Meteor.call('collectionInsert', {
          user: user._id,
          name: 'Interesting',
          color: '#f9d423'
        })
      )
    );

    Meteor.call('collectionInsert', {
      user: user._id,
      name: 'Work',
      color: '#16c1c8'
    });

    insertFragment({
      title: 'Tag your fragments',
      description: 'You can add as many tags as you want on each fragment, and filter your results by one or more. Click here to get started editing this card!',
      image: Meteor.absoluteUrl('/assets/img/tutorial/tags.jpg'),
      tags: ['Tutorial', 'Cute stuff'],
      collections: [interestingCollection, stuffCollection]
    });

    insertFragment({
      title: 'Infinite storage',
      description: 'Limited space? We have never heard of that, so you should probably not really worry about saving here all your fragments.',
      image: Meteor.absoluteUrl('/assets/img/tutorial/storage.png'),
      tags: ['Tutorial', 'Storage'],
      collections: [stuffCollection]
    });

    insertFragment({
      title: ['Hey', displayName + '!'].join(' '),
      description: 'Welcome to Fragments! This is your very first fragment, displayed here as a tutorial card. To dismiss it, click here and find the cross icon in the top right of the card.',
      image: Meteor.absoluteUrl('/assets/img/tutorial/welcome.png'),
      tags: ['Tutorial']
    });

    SearchHistory.insert({
      user: user._id,
      query: 'tutorial'
    });
  }
});