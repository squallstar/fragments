Handlebars.registerHelper('unless', function (obj) {
  return !obj;
});

Handlebars.registerHelper('equals', function (a, b) {
  return a === b;
});

Handlebars.registerHelper('timeAgo', function (timestamp) {
  return moment(timestamp).fromNow();
});