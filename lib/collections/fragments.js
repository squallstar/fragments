// Collection
Fragments = new Mongo.Collection('Fragments');

Fragments.before.insert(function (userId, fragment) {
  if (!fragment.created_at) {
    fragment.created_at = Date.now();
  }

  if (fragment.url) {
    fragment.url = sanitizeUrl(fragment.url);
    fragment.domain = urlToDomain(fragment.url);
  }

  if (!fragment.fetched_at) {
    fragment.fetched_at = null;
  }

  if (!fragment.lead_image && !_.isEmpty(fragment.images)) {
    fragment.lead_image = fragment.images[0].url;
  }
});

Fragments.before.update(function (userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.updated_at = Date.now();
}, { fetchPrevious: false });

Fragments.after.remove(function (userId, fragment) {
  Comments.remove({ fragment: fragment._id });
  Notifications.remove({ resource: fragment._id });
});

Meteor.methods({
  fragmentInsert: function (fragmentAttributes) {
    var user = Meteor.user();

    this.unblock();

    check(user._id, String);
    check(fragmentAttributes, {
      url: String,
      tags: Match.Optional([String]),
      collections: Match.Optional(Array)
    });

    var fragment = _.extend(fragmentAttributes, {
      url: fragmentAttributes.url.trim(),
      user: {
        _id: user._id,
        name: user.profile.name,
        picture: user.profile.picture
      },
      title: _.sample([
        'Fetching link',
        'Hang on',
        'Please wait',
        'Just one sec',
        'Almost done',
        'Grabbing link '
      ]) + '&hellip; 🕓'
    });

    // Check if fragment is a URL
    if (fragment.url && fragment.url.indexOf('.') === -1) {
      // Let's treat it as a note
      fragment.title = fragment.url;
      fragment.fetched_at = Date.now();
      delete fragment.url;

      if (!fragment.tags) {
        fragment.tags = [];
      }

      fragment.tags.push('Note');
    }

    fragment._id = Fragments.insert(fragment);

    if (Meteor.isServer && fragment.url) {
      Meteor.call('fragmentFetch', fragment._id, function () {
        // Nothing really, but this method should be run async
        // hence why we define a callback when running it on the server
      });
    }

    return fragment._id;
  },
  fragmentUpdate: function (fragmentId, newData) {
    this.unblock();

    check(Meteor.userId(), String);
    check(fragmentId, String);

    check(newData, {
      title: Match.Optional(String),
      description: Match.Optional(String),
      lead_image: Match.Optional(Match.OneOf(String, null)),
      images: Match.Optional(Array),
      tags: Match.Optional(Array),
      collections: Match.Optional(Array)
    });

    var fragment = _.extend(newData, {
      updated_at: Date.now()
    });

    var affected = Fragments.update(fragmentId, { $set: fragment });

    if (!affected) {
      throw new Meteor.Error(400, 'You weren\'t able to update this fragment');
    }
  },
  fragmentApplyChanges: function (fragmentId, operation, fieldName, value) {
    var changes = {},
        $operation = '$' + operation;

    check(Meteor.userId(), String);
    check(fragmentId, String);
    check(operation, Match.OneOf('push', 'pop', 'pull', 'addToSet'));
    check(fieldName, Match.OneOf('tags', 'collections'));
    check(value, Match.OneOf(String, Object));

    changes[$operation] = {};
    changes[$operation][fieldName] = value;

    var affected = Fragments.update(fragmentId, changes);

    if (!affected) {
      throw new Meteor.Error(400, 'You weren\'t able to update this fragment');
    }
  },
  fragmentDelete: function (fragmentId) {
    var userId = Meteor.userId();

    check(userId, String);
    check(fragmentId, String);

    var fragment = Fragments.findOne(fragmentId, {
          fields: {
            user: 1,
            'collections._id': 1,
            'collections.collaborators': 1
          }
        }),
        collections,
        canDelete;

    if (!fragment) {
      throw new Meteor.Error(404, 'The fragment has not been found');
    }

    if (fragment.collections) {
      collections = Collections.find(
        { _id: { $in: fragment.collections.map((c) => { return c._id; }) }},
        {
          fields: {
            'collaborators._id': 1
          }
        }
      ).fetch();
    }

    if (fragment.user._id === userId) {
      canDelete = true;
    } else if (collections) {
      let inCollections = _.compact(_.values(_.map(collections, (collection) => {
        if (collection.collaborators) {
          if (_.find(collection.collaborators, (u) => { return u._id === userId })) {
            return collection._id;
          }
        }
      })));

      // Fragment can be deleted if collaborator has got this fragment
      // in all the fragment collections
      if (inCollections.length === fragment.collections.length) {
        canDelete = true;
      } else {
        // We pull the fragment from the collections this user has access to
        return Fragments.update(fragmentId, {
          $pull: {
            'collections': { _id: { $in: inCollections } }
          }
        });
      }
    }

    if (!canDelete) {
      throw new Meteor.Error(400, 'You cannot delete this fragment');
    }

    var affected = Fragments.remove(fragmentId);

    if (!affected) {
      throw new Meteor.Error(400, 'You weren\'t able to delete this fragment');
    }
  }
});

function sanitizeUrl (url) {
  if (url.match(/^\/\//)) {
    return 'http:' + url;
  }

  if (!url.match(/^https?:\/\//)) {
    return 'http://' + url;
  }

  return url;
}

function urlToDomain(url) {
  if (Meteor.isServer) {
    return url.replace(/^https?:\/\//, '');
  }

  var anchor = document.createElement('a');
  anchor.href = url;
  return anchor.hostname;
}