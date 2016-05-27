const CURRENT_VERSION = 1;

var migrations = {
  1: function () {
    Fragments.find().forEach(function (fragment) {
      var user = Meteor.users.findOne(fragment.user);

      if (!user) {
        return Fragment.remove(fragment._id);
      }

      Fragments.update(fragment._id, {
        $set: {
          user: {
            _id: user._id,
            name: user.profile.name,
            picture: user.profile.picture
          }
        }
      })
    });
  }
};

Meteor.startup(function () {
  var upToDate = !!Migrations.findOne({ version: CURRENT_VERSION });

  if (upToDate) {
    return;
  }

  console.log('Applying migration:', CURRENT_VERSION);

  migrations[CURRENT_VERSION]();

  console.log('Migration has been applied:', CURRENT_VERSION);

  Migrations.insert({
    version: CURRENT_VERSION,
    created_at: Date.now()
  });
});