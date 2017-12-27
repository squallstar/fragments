Template.modal.helpers({
  showOnboarding: function () {
    return Template.instance().showOnboarding.get();
  },
  showShare: function () {
    return Session.get(MODAL_SHARE);
  },
  busy: function () {
    return Template.instance().isBusy.get();
  },
  fragment: function () {
    var id = Session.get(MODAL_SHARE);
    if (id) {
      return Fragments.findOne(id);
    }
  }
})

Template.modal.events({
  'click': function (event, template) {
    if (event.target.id !== 'modal') {
      // Clicking on the dark overlay will dismiss the modal, but clicking inside won't.
      if (template.showOnboarding.get() || Session.get(MODAL_SHARE)) {
        return; // only dismissable via the dismiss button
      }
    }

    Session.set(MODAL_VISIBLE_KEY, false);
    Session.set(SIDEBAR_OPEN_KEY, false);
    Session.set(RIGHT_SIDEBAR_OPEN_KEY, false);
    Session.set(MODAL_SHARE, false);
  },
  'submit [data-share]': function (event, template) {
    event.preventDefault();
    template.isBusy.set(true);

    Meteor.call('shareFragment', Session.get(MODAL_SHARE), template.$('input[type="email"]').val(), function (err) {
      template.isBusy.set(false);

      if (err) {
        return UINotification.error(err.reason);
      }

      UINotification.success('The fragment has been shared to the target recipient.');
      Session.set(MODAL_SHARE, false);
      Session.set(MODAL_VISIBLE_KEY, false);
    });
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
  this.isBusy = new ReactiveVar(false);
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

    if (Session.get(MODAL_SHARE)) {
      setTimeout(function () {
        template.$('input[type="email"]').focus();
      }, 100);
    }
  });
});