// Application Helper
SetContextMenu = function (options) {
  if (!options || !options.event || !options.actions) {
    delete Template.contextualMenu.source;
    return Session.set(CURRENT_CONTEXTUAL_MENU);
  }

  // Store a reference to the Blaze instance that called this menu
  Template.contextualMenu.source = options.template;

  var x = options.event.pageX,
      y = options.event.pageY,
      isLeftSide = false,
      menuWidth = 170, // these are average values
      menuHeight = 100;

  // Make sure the menu is visible in the viewport
  if (x + menuWidth >= window.innerWidth) {
    x -= menuWidth;
  }

  // Make sure submenus are visible
  if (x + menuWidth*2 >= window.innerWidth) {
    isLeftSide = true;
  }

  if (y + menuHeight >= window.innerHeight) {
    y -= menuHeight;
  }

  Session.set(CURRENT_CONTEXTUAL_MENU, {
    position: {
      x: x,
      y: y,
      isLeftSide: isLeftSide
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
  positionX: function () {
    return Template.instance().position.get().x;
  },
  positionY: function () {
    return Template.instance().position.get().y;
  },
  isLeftSide: function () {
    return Template.instance().position.get().isLeftSide;
  },
  actions: function () {
    return Template.instance().actions.list();
  }
});

Template.contextualMenu.onCreated(function () {
  this.isOpen = new ReactiveVar(false);
  this.position = new ReactiveVar({ x: 0, y: 0, isLeftSide: false });
  this.actions = new ReactiveArray();

  this.autorun(() => {
    this.isOpen.set(false);

    let menu = Session.get(CURRENT_CONTEXTUAL_MENU);

    if (!menu || !menu.actions.length) {
      return;
    }

    // Data
    this.actions.clear();
    menu.actions.forEach((action) => {
      this.actions.push(action);
    });

    // Update reactive vars
    this.position.set(menu.position);
    this.isOpen.set(true);
  });
});

Template.contextualMenu.events({
  'click a': function (event, template) {
    event.preventDefault();
    event.stopPropagation();

    let $node = $(Template.contextualMenu.source.firstNode),
        $target = $(event.target),
        eventName = $target.data('event');

    // No action when there's a sub menu
    if ($target.parent('li').find('ul').length) {
      return;
    }

    // Triggers the event on the caller
    if ($node.length) {
      $node.trigger(eventName);
    }

    // Closes the menu
    template.isOpen.set(false);
    SetContextMenu();
  }
});