// DB Indexes
Meteor.startup(function () {
  Fragments._ensureIndex({ 'user': 1 });
  Fragments._ensureIndex({ 'tags': 1 });
  Fragments._ensureIndex({ 'collections._id': 1 });
  Fragments._ensureIndex({
    title: 'text',
    description: 'text',
    url: 'text',
    tags: 'text'
  }, {
    name: 'text_index'
  });

  Collections._ensureIndex({ 'user': 1 });

  SearchHistory._ensureIndex({ 'user': 1 });
  SearchHistory._ensureIndex({ 'query': 1 });
});