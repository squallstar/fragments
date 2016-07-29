Template.sidebarCollection.helpers({
  isCurrent: function () {
    var currentCollection = Session.get(CURRENT_COLLECTION_KEY);
    return currentCollection && currentCollection._id === this._id;
  },
  isOwned: function () {
    return this.user === Meteor.userId();
  },
  hasCollaborators: function () {
    return this.collaborators ? (this.collaborators.length > 1 ? this.collaborators.length : 0) : false;
  },
  collaboratorsDescription: function () {
    if (!this.collaborators || this.collaborators.length < 2) {
      return;
    }

    var userId = Meteor.userId();

    return _.map(
      _.filter(this.collaborators, (c) => { return c._id !== userId }), (u) => {
        return u.name.split(' ')[0];
      }
    ).join(', ');
  }
});

Template.sidebarCollection.events({
  'mouseenter .item': function (event, template) {
    var $el = $(event.target),
        color = $el.find('> span').css('background-color');

    if ($el.closest('li').hasClass('current')) {
      return;
    }

    if (color) {
      $el.css('background-color', shadeColor(rgb2hex(color), 0.8));
    }
  },
  'mouseleave .item': function (event) {
    $(event.target).css('background-color', 'transparent');
  },
  'click [data-leave-collection]': function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (confirm('Do you want to leave this collection?')) {
      Meteor.call('leaveCollaborationCollection', this._id);
    }
  }
});

function rgb2hex (rgb) {
  if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

  function hex(x) {
      return ('0' + parseInt(x).toString(16)).slice(-2);
  }

  return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function shadeColor (color, percent) {
    var f = parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#" + (0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}