// Collection
Fragments = new Mongo.Collection('Fragments');

// Allow rules
Fragments.allow({
  update: function(userId, fragment) { return ownsDocument(userId, fragment); },
  remove: function(userId, fragment) { return ownsDocument(userId, fragment); }
});

// Hooks to be triggered before insert
Fragments.before.insert(function (userId, fragment) {
  fragment.created_at = Date.now();

  if (fragment.url) {
    fragment.url = sanitizeUrl(fragment.url);
    fragment.domain = urlToDomain(fragment.url);
  }

  if (!fragment.fetched_at) {
    fragment.fetched_at = null;
  }

  if (fragment.images && !fragment.lead_image) {
    fragment.lead_image = fragment.images[0].url;
  }
});

// Hooks to be triggered before update
Fragments.before.update(function (userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.updated_at = Date.now();
}, { fetchPrevious: false });

Meteor.methods({
  fragmentInsert: function(fragmentAttributes) {
    check(Meteor.userId(), String);
    check(fragmentAttributes, {
      url: String,
      tags: Match.Optional(Array)
    });

    var fragment = _.extend(fragmentAttributes, {
      user: Meteor.userId(),
      title: _.sample([
        'Fetching link', 'Hang on', 'Please wait', 'Just one sec', 'Almost done', 'Grabbing link'
      ]) + '&hellip;'
    });

    fragment._id = Fragments.insert(fragment);

    if (Meteor.isServer) {
      Meteor.call('fragmentFetch', fragment._id, function () {
        // done fetching link
      });
    }

    return fragment._id;
  },
  fragmentUpdate: function (fragmentId, newData) {
    check(Meteor.userId(), String);
    check(fragmentId, String);

    check(newData, {
      title: Match.Optional(String),
      description: Match.Optional(String),
      lead_image: Match.Optional(Match.OneOf(String, null)),
      images: Match.Optional(Array),
      tags: Match.Optional(Array)
    });

    var fragment = _.extend(newData, {
      updated_at: Date.now()
    });

    var affected = Fragments.update(fragmentId, { $set: fragment });

    if (!affected) {
      throw new Meteor.Error('invalid', 'You weren\'t able to update this fragment');
    }
  },
  fragmentApplyChanges: function (fragmentId, operation, fieldName, value) {
    var changes = {},
        $operation = '$' + operation;

    check(Meteor.userId(), String);
    check(fragmentId, String);
    check(operation, Match.OneOf('push', 'pop', 'pull', 'addToSet'));
    check(fieldName, Match.OneOf('tags'));
    check(value, String);

    changes[$operation] = {};
    changes[$operation][fieldName] = value;

    var affected = Fragments.update(fragmentId, changes);

    if (!affected) {
      throw new Meteor.Error('invalid', 'You weren\'t able to update this fragment');
    }
  },
  fragmentDelete: function (fragmentId) {
    check(Meteor.userId(), String);
    check(fragmentId, String);

    var affected = Fragments.remove(fragmentId);

    if (!affected) {
      throw new Meteor.Error('invalid', 'You weren\'t able to delete this fragment');
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