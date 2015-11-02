const pageSize = 10; // items per page
const viewportPrefetchHeight = 50; // px

Template.fragmentsList.helpers({
  // the fragments cursor
  fragments: function () {
    return Template.instance().fragments();
  },
  // are there more fragments to show?
  isLoadingMore: function () {
    return Template.instance().isBusy.get();
  }
});

var $window = $(window);
var bindScroll = function (event) {
  var instance = event.data,
      $list = instance.$masonry,
      listHeight = $list.height();

  if (instance.isBusy.get()) {
    return;
  }

  var offset = $window.scrollTop(),
      viewportHeight = $window.height(),
      contentHeight = parseInt($list.height() || $list.css('height'));

  if (offset < (contentHeight - viewportHeight - viewportPrefetchHeight)) {
    return;
  }

  instance.isBusy.set(true);

  // get current value for limit, i.e. how many posts are currently displayed
  var limit = instance.limit.get();

  // increase limit
  limit += pageSize;
  instance.limit.set(limit);
}

Template.fragmentsList.onCreated(function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.isBusy = new ReactiveVar(true);
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(pageSize);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  instance.autorun(function () {

    // get the limit
    var limit = instance.limit.get();

    // subscribe to the posts publication
    var subscription = instance.subscribe('fragments', { sort: { created_at: -1 }, limit: limit }, function () {
      instance.$masonry.masonry('reloadItems').masonry('layout');
    });

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      instance.loaded.set(limit);
      instance.isBusy.set(false);
      bindScroll({ data: instance });
    }
  });

  // 3. Cursor

  instance.fragments = function() {
    return Fragments.find({}, { sort: { created_at: -1 }, limit: instance.loaded.get() });
  }

  // 4. UI Events
  $(window).on('scroll', instance, bindScroll);
});

Template.fragmentsList.onDestroyed(function () {
  // 1. UI Events
  $(window).off('scroll', bindScroll);
});

Template.fragmentsList.onRendered(function () {
  // setup masonry
  var selector = '.fragments-list',
      $masonry = this.$(selector);
  this.$masonry = $masonry;

  $masonry.masonry({
    itemSelector: '.fragment-item',
    transitionDuration: 0
  });

  this.find(selector)._uihooks = {
    insertElement: function (node, next) {
      var $node = $(node);

      $node.insertBefore(next);

      $masonry.masonry('reloadItems').masonry('layout');
    },
    removeElement: function(node) {
      $masonry.masonry('remove', node);
    }
  }
});