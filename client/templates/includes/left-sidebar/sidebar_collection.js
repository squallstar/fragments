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
  'click [data-leave-collection]': function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (confirm('Do you want to leave this collection?')) {
      Meteor.call('leaveCollaborationCollection', this._id);
    }
  }
});