const KADIRA_APP_ID = 'oaJDaHZscXxEtiMxG';
const KADIRA_API_KEY = Meteor.settings.kadiraKey;

if (KADIRA_API_KEY) {
  Kadira.connect(KADIRA_APP_ID, KADIRA_API_KEY);
}