// DB Indexes
Meteor.startup(function () {
  Fragments._ensureIndex({ "user": 1});
});