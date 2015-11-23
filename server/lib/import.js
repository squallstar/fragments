Meteor.methods({
  importData: function (input) {
    var userId = Meteor.userId(),
        userCollections = {},
        importedStats = {
          collections: 0,
          fragments: 0
        },
        data;

    check(userId, String);
    check(input, String);

    data = JSON.parse(input);

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
        let collectionId = Collections.insert(_.extend(
          _.pick(
            collection,
            'name', 'slug', 'color', 'is_hidden', 'is_public'
          ),
          { user: userId }
        ));

        userCollections[collection._id] = Collections.findOne(collectionId);
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
          'description', 'images', 'lead_image', 'tags'
        ),
        { user: userId }
      ));

      Job.push(new FetchFragmentJob({
        fragmentId: fragmentId
      }));

      importedStats.fragments++;
    });

    return importedStats;
  }
});