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
  firstCollaborator: function () {
    if (!this.collaborators || this.collaborators.length < 2) {
      return;
    }

    var userId = Meteor.userId();

    return _.find(this.collaborators, (c) => { return c._id !== userId }).name.split(' ')[0];
  }
});

Template.sidebarCollection.events({
  'click .icon-cog': function (event) {
    event.preventDefault();
    Router.go('collectionSettings', this);
  },
  'click .icon-bin': function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (confirm('Do you want to leave this collection?')) {
      Meteor.call('leaveCollaborationCollection', this._id);
    }
  }
});