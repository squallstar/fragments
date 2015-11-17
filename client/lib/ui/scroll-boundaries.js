UI.setScrollBoundaries = function (template, selector) {
  template.onRendered(function () {
    var $selector = this.$(selector);

    // Prevent scrolling off the boundaries
    this.$(selector).on('mousewheel', function (event) {
      var height = $selector.height(),
          goingUp = event.originalEvent.wheelDelta > 0,
          scrollHeight = $selector.get(0).scrollHeight,
          scrollTop = $selector.scrollTop(),
          endReached = scrollTop === scrollHeight - height,
          blockScrolling = endReached && !goingUp || !scrollTop && goingUp;

      if (blockScrolling) {
        event.preventDefault();
      }
    });
  });

  template.onDestroyed(function () {
    this.$(selector).off('mousewheel', '**');
  });
};