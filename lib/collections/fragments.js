// Collection
Fragments = new Mongo.Collection('Fragments');

// Hooks to be triggered before insert
Fragments.before.insert(function (userId, fragment) {
  fragment.created_at = Date.now();
  fragment.fetched_at = null;
  fragment.url = sanitizeUrl(fragment.url);
  fragment.domain = urlToDomain(fragment.url);
});

// Hooks to be triggered before update
Fragments.before.update(function (userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.updated_at = Date.now();
}, { fetchPrevious: false });

Meteor.methods({
  fragmentInsert: function(fragmentAttributes) {
    check(fragmentAttributes, {
      url: String
    });

    var fragment = _.extend(fragmentAttributes, {
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