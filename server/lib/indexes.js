// DB Indexes
Meteor.startup(function () {
  Fragments._ensureIndex({ pinned_at: -1, created_at: -1 });
  Fragments._ensureIndex({ user: 1 });
  Fragments._ensureIndex({ tags: 1 });
  Fragments._ensureIndex({ archived: 1 });
  Fragments._ensureIndex({ 'collections._id': 1 });
  Fragments._ensureIndex({
    title: 'text',
    description: 'text',
    url: 'text',
    tags: 'text'
  }, {
    name: 'text_index'
  });

  Collections._ensureIndex({ user: 1 });
  Collections._ensureIndex({ is_public: 1 });
  Collections._ensureIndex({ collaboration_token: 1 });
  Collections._ensureIndex({ 'collaborators._id': 1 });

  SearchHistory._ensureIndex({ user: 1 });
  SearchHistory._ensureIndex({ query: 1 });

  Notifications._ensureIndex({ user: 1 });
  Notifications._ensureIndex({ read_at: 1 });
  Notifications._ensureIndex({ resource: 1 });
});