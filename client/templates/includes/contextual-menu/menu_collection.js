function collectionIsActive (id) {
  var source = Template.contextualMenu.source;
  if (source && source.data && source.data.collections) {
    for (var i = 0; i < source.data.collections.length; i++) {
      if (source.data.collections[i]._id === id) {
        return true;
      }
    }
  }
}

Template.menuCollection.helpers({
  isActive: function () {
    return collectionIsActive(this._id);
  }
});

Template.menuCollection.events({
  'click a': function (event, template) {
    event.preventDefault();
    event.stopPropagation();

    var collectionId = template.data._id,
        isActive = collectionIsActive(collectionId),
        operation = isActive ? 'pull' : 'addToSet',
        fragmentId = Template.contextualMenu.source.data._id;

    $(event.target).closest('li').toggleClass('active', !isActive);

    Meteor.call(
      'fragmentApplyChanges',
      fragmentId,
      operation,
      'collections',
      Collections.shrink(template.data)
    );
  }
});