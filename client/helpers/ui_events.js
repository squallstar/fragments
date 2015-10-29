var $window = $(window);

UIEvents = {
    window: $window
};

UIEvents.isVisible = function ($target) {
    var threshold;

    if (!$target.length) return;

    threshold = $window.scrollTop() + $window.height() - $target.height();

    if ($target.offset().top < threshold) {
        if (!$target.data("visible")) {
            // console.log("$target became visible (inside viewable area)");
            $target.data("visible", true);
            return true;
        }
    } else {
        if ($target.data("visible")) {
            // console.log("$target became invisible (below viewable arae)");
            $target.data("visible", false);
            return false;
        }
    }
}