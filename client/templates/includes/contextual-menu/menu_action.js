const EVENT_NAME = 'collections';

Template.menuAction.helpers({
  withCollections: function () {
    return this.eventName === EVENT_NAME;
  },
  collections: function () {
    if (this.eventName === EVENT_NAME) {
      return Meteor.visibleCollections();
    }
  }
});