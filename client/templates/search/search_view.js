Template.searchView.helpers({
  hasHistory: function () {
    return SearchHistory.find().count() > 0;
  }
});

Template.searchView.events({
  'click [data-clear]': function (event) {
    event.preventDefault();
    Meteor.call('clearSearchHistory');
  }
})