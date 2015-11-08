// DB Indexes
Meteor.startup(function () {
  Fragments._ensureIndex({ 'user': 1 });

  SearchHistory._ensureIndex({ 'user': 1 });
  SearchHistory._ensureIndex({ 'query': 1 });
});