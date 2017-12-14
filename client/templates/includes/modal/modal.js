Template.modal.helpers({
  showOnboarding: function () {
    return Template.instance().showOnboarding.get();
  }
})

Template.modal.events({
  'click': function (event, template) {
    if (template.showOnboarding.get()) {
      return; // only dismissable via the dismiss button
    }

    Session.set(MODAL_VISIBLE_KEY, false);
    Session.set(SIDEBAR_OPEN_KEY, false);
    Session.set(RIGHT_SIDEBAR_OPEN_KEY, false);
  },
  'click [data-dismiss]': function (event, template) {
    Session.set(MODAL_VISIBLE_KEY, false);

    Meteor.call('setOnboardingStage', 1, function () {
      template.showOnboarding.set(false);
    })
  }
});

Template.modal.onCreated(function () {
  this.showOnboarding = new ReactiveVar(false);
});

Template.modal.onRendered(function () {
  var template = this;

  Tracker.autorun(function () {
    if (Meteor.user()) {
      setTimeout(function () {
        if (!Meteor.user().profile.onboarding) {
          template.showOnboarding.set(true);
          Session.set(MODAL_VISIBLE_KEY, true);
        }
      }, 1000);
    }
  });
});