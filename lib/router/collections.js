var CollectionController = RouteController.extend({
  waitOn: function () {
    return Meteor.subscribe('collection', this.params._id);
  },
  data: function () {
    return {
      collection: this.collection
    };
  },
  seo: {
    title: function () {
      var collection = this.data().collection;
      return collection ? collection.name : '';
    }
  },
  onBeforeAction: function () {
    var collection = Collections.findOne(this.params._id);

    if (!collection) {
      return this.render('notFound');
    }

    if (this.route.getName() !== 'collection') {
      // Check if user is owner before displaying routes that are not the overview
      if (collection.user !== Meteor.userId()) {
        return this.render('notFound');
      }
    }

    Session.set(CURRENT_COLLECTION_KEY, collection);

    this.collection = collection;
    this.next();
  }
});

/* ------------------------------------------------------------------ */

Router.route('/collections/:_id', {
  name: 'collection',
  template: 'fragmentsList',
  controller: CollectionController
});

/* ------------------------------------------------------------------ */

Router.route('/collections/:_id/settings', {
  name: 'collectionSettings',
  controller: CollectionController,
  onRun: function () {
    Session.set(HIDE_SEARCH_BAR, true);
    Session.set(HAS_BACK_ARROW_KEY, true);
    this.next();
  },
  onStop: function () {
    Session.set(HIDE_SEARCH_BAR, false);
    Session.set(HAS_BACK_ARROW_KEY, false);
  }
});

/* ------------------------------------------------------------------ */

Router.route('/collaborate/:collaboration_token', {
  name: 'collectionCollaborate',
  data: function () {
    return this.params.collaboration_token;
  },
  seo: {
    title: function () {
      return 'Invite to join as a collaborator';
    }
  },
});

/* ------------------------------------------------------------------ */

Router.route('/add-fragment/:collaboration_token', { where: 'server' }).get(function () {
  const res = this.response;

  const collaboration_token = this.params.collaboration_token;
  const url = this.params.query.url;
  const source = this.params.query.source || 'API';

  if (!url) {
    res.status = 400;
    return res.end(JSON.stringify({ error: 'Parameter "url" is required' }));
  }

  const collection = Collections.findOne({
    collaboration_token
  });

  if (!collection) {
    res.status = 400;
    return res.end(JSON.stringify({ error: 'Collection not found' }));
  }

  const fragmentId = Meteor.call('fragmentInsert', {
    url,
    user: Meteor.users.findOne(collection.user),
    source,
    collections: [_.pick(collection, ['_id', 'name', 'color'])]
  });

  res.end(JSON.stringify(Fragments.findOne(fragmentId)));
});