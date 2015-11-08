Template.searchHistoryItem.events({
  'click': function (event) {
    event.preventDefault();

    Router.go('searchResults', {
      text: this.query
    });
  }
})