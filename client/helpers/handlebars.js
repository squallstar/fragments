Handlebars.registerHelper('unless', function (obj) {
  return !obj;
});

Handlebars.registerHelper('equals', function (a, b) {
  return a === b;
});

Handlebars.registerHelper('hasMany', function (array, minItems) {
  return typeof array === 'object' && array.length > 1;
});

Handlebars.registerHelper('timeAgo', function (timestamp) {
  return moment(timestamp).fromNow();
});