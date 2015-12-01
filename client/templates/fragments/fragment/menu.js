// Application Helper
SetContextMenu = function (options) {
  if (!options || !options.event || !options.actions) {
    return Session.set(CURRENT_CONTEXTUAL_MENU);
  }

  Session.set(CURRENT_CONTEXTUAL_MENU, {
    position: {
      x: options.event.pageX,
      y: options.event.pageY
    },
    actions: options.actions
  });
};

// UI Helpers
UI.setAutofocus(Template.contextualMenu, {
  sessionKey: CURRENT_CONTEXTUAL_MENU
});

Template.contextualMenu.helpers({
  isOpen: function () {
    return Template.instance().isOpen.get();
  },
  position: function () {
    return Template.instance().position.get();
  },
  isOpen: function () {
    return Template.instance().isOpen.get();
  },
  actions: function () {
    return Template.instance().actions;
  }
});

Template.contextualMenu.onCreated(function () {
  this.isOpen = new ReactiveVar(false);
  this.position = new ReactiveVar({ x: 0, y: 0 });

  this.autorun(() => {
    this.isOpen.set(false);

    let menu = Session.get(CURRENT_CONTEXTUAL_MENU);

    if (!menu) {
      return;
    }

    // Data
    this.actions = menu.actions;

    // Update reactive vars
    this.position.set(menu.position);
    this.isOpen.set(true);
  });
});

Template.contextualMenu.events({
  'click a': function (event, template) {
    event.preventDefault();
    event.stopPropagation();

    template.instance().isOpen.set(false);
    SetContextMenu();
  }
});