Meteor.startup(function () {
  const swipe = new Hammer(document.body);

  function getStartPosition(e) {
    const delta_x = e.deltaX;
    const delta_y = e.deltaY;
    const final_x = e.srcEvent.pageX || e.srcEvent.screenX || 0;
    const final_y = e.srcEvent.pageY || e.srcEvent.screenY || 0;

    return {
      x: final_x - delta_x,
      y: final_y - delta_y
    }
  };

  swipe.on('swiperight swipeleft', function (e) {
    e.preventDefault();
    const { x } = getStartPosition(e);
    Session.set(SIDEBAR_OPEN_KEY, e.type == 'swiperight' && x >= 0 && x <= 50);
  });
});