Template.searchView.helpers({
  hasHistory: function () {
    return SearchHistory.find().count() > 0;
  },
  tagsLoaded: function () {
    return Template.instance().tagsLoaded.get();
  },
  tags: function () {
    return Template.instance().tags || [];
  }
});

Template.searchView.events({
  'click [data-clear]': function (event) {
    event.preventDefault();
    Meteor.call('clearSearchHistory');
  }
});

Template.searchView.onCreated(function () {
  this.tagsLoaded = new ReactiveVar(false);
});

Template.searchView.onRendered(function () {
  Meteor.call('getTags', (err, tags) => {
    this.tags = tags;
    this.tagsLoaded.set(true);
  });
})