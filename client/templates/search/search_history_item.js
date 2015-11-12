Template.searchHistoryItem.events({
  'click a': function (event) {
    event.preventDefault();
    Router.go('searchResults', { text: this.query });
  }
});