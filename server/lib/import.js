Meteor.methods({
  importData: function (input) {
    var userId = Meteor.userId(),
        user = Meteor.users.findOne(userId),
        userCollections = {},
        importedStats = {
          collections: 0,
          fragments: 0
        },
        data;

    check(userId, String);
    check(input, String);

    try {
      data = JSON.parse(input);
    } catch (err) {
      throw new Meteor.Error(400, 'Uploaded file is not a valid JSON');
    }

    check(data, Object);
    check(data.collections, Array);
    check(data.fragments, Array);

    // Insert collections
    _.each(data.collections, function (collection) {
      check(collection._id, String);
      check(collection.name, String);
      check(collection.slug, String);

      var existing = Collections.findOne({
        $or: [
          { _id: collection._id, user: userId },
          { slug: collection.slug, user: userId }
        ]
      });

      if (existing) {
        userCollections[collection._id] = existing;
      } else {
        // White-list keys to be added
        let newCollectionId = Collections.insert(_.extend(
          _.pick(
            collection,
            'name', 'slug', 'color', 'is_hidden', 'is_public'
          ),
          {
            user: userId,
            collaborators: [{
              _id: userId,
              name: user.profile.name,
              picture: user.profile.picture,
              role: 'owner'
            }]
          }
        ));

        userCollections[collection._id] = Collections.findOne(newCollectionId);
        importedStats.collections++;
      }
    });

    // Insert fragments
    _.each(data.fragments, function (fragment) {
      check(fragment.url, String);

      // Remap collections to new IDs
      fragment.collections = _.map(fragment.collections, function (collection) {
        if (userCollections[collection._id]) {
          return Collections.shrink(userCollections[collection._id]);
        }
      });

      let fragmentId = Fragments.insert(_.extend(
        _.pick(
          fragment,
          'url', 'title', 'created_at', 'fetched_at', 'updated_at', 'domain', 'provider_name',
          'description', 'images', 'lead_image', 'tags', 'collections'
        ),
        {
          user: {
            _id: userId,
            name: user.profile.name,
            picture: user.profile.picture
          }
        }
      ));

      if (!fragment.fetched_at) {
        Job.push(new FetchFragmentJob({
          fragmentId: fragmentId
        }));
      }

      importedStats.fragments++;
    });

    return importedStats;
  }
});