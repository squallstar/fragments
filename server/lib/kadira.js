const { kadiraKey } = Meteor.settings;

if (kadiraKey) {
  Kadira.connect('oaJDaHZscXxEtiMxG', kadiraKey);
}