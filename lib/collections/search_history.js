// Collection
SearchHistory = new Mongo.Collection('SearchHistory');

// Allow rules
SearchHistory.allow({
  remove: function(userId, doc) { return ownsDocument(userId, doc); }
});

// Hooks to be triggered before insert
SearchHistory.before.insert(function (userId, doc) {
  doc.created_at = Date.now();
});

Meteor.methods({
  searchHistoryInsert: function(query) {
    check(Meteor.userId(), String);
    check(query, String);

    var doc = {
      user: Meteor.userId(),
      query: query
    };

    return SearchHistory.insert(doc);
  }
});