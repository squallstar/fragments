Template.sidebarCollection.helpers({
  isCurrent: function () {
    var currentCollection = Session.get(CURRENT_COLLECTION_KEY);
    return currentCollection && currentCollection._id === this._id;
  }
});