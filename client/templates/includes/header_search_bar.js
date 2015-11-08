Template.header_search_bar.events({
  'focus input': function () {
    if (Router.current().route.getName() !== 'search') {
      Router.go('search');
    }
  }
});