Template.collectionCollaborate.helpers({
  collection: function () {
    return Template.instance().collection.get();
  },
  owner: function () {
    return Template.instance().owner.get();
  }
});

Template.collectionCollaborate.onCreated(function () {
  var token = this.data;

  this.collection = new ReactiveVar();
  this.owner = new ReactiveVar();

  Session.set(APP_BUSY_KEY, true);

  Meteor.call('getCollaborationCollection', token, (error, collection) => {
    var userId = Meteor.userId();

    Session.set(APP_BUSY_KEY, false);

    if (!collection) {
      return this.render('notFound');
    }

    if (!userId) {
      Session.set(COLLABORATE_TOKEN, token);
    }

    if (_.find(collection.collaborators, (c) => { return c._id === userId })) {
      return Router.go('collection', collection);
    }

    this.owner.set(_.find(collection.collaborators, (c) => { return c._id === collection.user }));
    this.collection.set(collection);
  });
});

Template.collectionCollaborate.events({
  'submit form': function (event, template) {
    event.preventDefault();

    if (!Meteor.userId()) {
      return Router.go('login');
    }

    Meteor.call('joinCollaborateCollection', template.data, function () {
      Session.set(COLLABORATE_TOKEN, null);

      Router.go('collection', template.collection.get());
    });
  }
});