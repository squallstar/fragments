// This is being used by the Chrome Plugin

Template.addFragmentPopup.helpers({
  collectionsSaved: function () {
    return Template.instance().collectionsSaved.get();
  },
  fragmentId: function () {
    return Template.instance().fragmentId.get();
  },
  fragment: function () {
    return Fragments.findOne(Template.instance().fragmentId.get());
  },
  collections: function () {
    return Meteor.visibleCollections();
  },
  isSelected: function (collection) {
    var selected = Template.instance().selectedCollections.list();
    return selected.indexOf(collection._id) !== -1;
  },
  hasSelectedCollections: function () {
    return Template.instance().selectedCollections.list().length > 0;
  }
});

Template.addFragmentPopup.events({
  'click .collections li a': function (event, template) {
    event.preventDefault();
    event.stopPropagation();

    var id = this._id;

    if (template.selectedCollections.array().indexOf(id) === -1) {
      template.selectedCollections.push(id);
    } else {
      template.selectedCollections.remove(id);
    }
  },
  'click [data-save]': function (event, template) {
    var collections = Collections.find({
      _id: { $in: template.selectedCollections.array() }
    }).map(function (collection) {
      return collection;
    });

    Meteor.call('fragmentUpdate', template.fragmentId.get(), {
      collections: collections
    }, function () {
      template.collectionsSaved.set(true);
      window.close();
    });
  }
});

Template.addFragmentPopup.onCreated(function () {
  this.fragmentId = new ReactiveVar();
  this.selectedCollections = new ReactiveArray();
  this.collectionsSaved = new ReactiveVar(false);

  Meteor.call('fragmentInsert', { url: this.data }, (error, fragmentId) => {
    if (error) {
      return UINotification.error(error);
    }

    this.fragmentId.set(fragmentId);

    Meteor.subscribe('fragments', {
      _id: fragmentId
    });

    UINotification.success(_.sample(['All done!', 'Saved!', 'Got it!']));
  });
});