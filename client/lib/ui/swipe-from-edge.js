Meteor.startup(function () {
  $('html').hammer().on('swiperight', function (e) {
    var endPoint = e.gesture.pointers[0].pageX,
        distance = e.gesture.distance,
        origin = endPoint - distance;

    if (origin <= 15) {
      Session.set(SIDEBAR_OPEN_KEY, true);
    }
  });
});