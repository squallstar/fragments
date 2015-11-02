Handlebars.registerHelper('isNull', function (obj) {
  return obj === null || obj === undefined;
});

Handlebars.registerHelper('equals', function (a, b) {
  return a === b;
});