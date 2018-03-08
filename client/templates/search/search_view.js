Template.searchView.helpers({
  hasHistory: function () {
    return SearchHistory.find().count() > 0;
  },
  tagsLoaded: function () {
    return Template.instance().tagsLoaded.get();
  },
  tags: function () {
    return Template.instance().tags || [];
  },
  collection: function () {
    return Session.get(CURRENT_COLLECTION_KEY);
  },
  collaborators: function () {
    var collaborators = [];
    var collections = Collections.find().fetch().forEach(function (collection) {
      if (Array.isArray(collection.collaborators)) {
        collaborators = collaborators.concat(collection.collaborators);
      }
    });

    collaborators = _.uniq(collaborators, function (person) {
      return person._id;
    });

    // Don't display when there's only us
    if (collaborators.length === 1) {
      return [];
    }

    return _.sortBy(collaborators, function (person) {
      return person.name;
    });
  } 
});

Template.searchView.events({
  'click [data-clear]': function (event) {
    event.preventDefault();
    Meteor.call('clearSearchHistory');
  },
  'click .tags a': function (event) {
    var tag = $(event.currentTarget).html();
    event.preventDefault();

    Session.set(CURRENT_TAG_KEY, tag);
    Router.goToRelevant();
  },
  'click .collaborators a': function (event) {
    var person = $(event.currentTarget).html();
    event.preventDefault();

    Session.set(CURRENT_COLLABORATOR_KEY, person);
    Router.goToRelevant();
  }
});

Template.searchView.onCreated(function () {
  this.tagsLoaded = new ReactiveVar(false);
});

Template.searchView.onRendered(function () {
  var collection = Session.get(CURRENT_COLLECTION_KEY),
      options = {};

  if (collection) {
    options.collection = collection._id;
  }

  Meteor.call('getTags', options, (err, tags) => {
    this.tags = tags;
    this.tagsLoaded.set(true);
  });
})