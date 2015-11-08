// Collection
SearchHistory = new Mongo.Collection('SearchHistory');

// Allow rules
SearchHistory.allow({
  remove: function(userId, doc) { return ownsDocument(userId, doc); }
});

SearchHistory.before.insert(function (userId, doc) {
  doc.created_at = Date.now();
});

Meteor.methods({
  addSearchHistory: function (query) {
    check(Meteor.userId(), String);
    check(query, String);

    var doc = SearchHistory.findOne({ query: query });

    if (doc) {
      SearchHistory.update(doc, { $set: { created_at: Date.now() } });
      return doc;
    }

    doc = {
      user: Meteor.userId(),
      query: query
    };

    return SearchHistory.insert(doc);
  },
  clearSearchHistory: function () {
    check(Meteor.userId(), String);

    return SearchHistory.remove({ user: Meteor.userId() });
  }
});