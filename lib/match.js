Match.NonEmptyString = Match.Where(function (x) {
  return typeof x === 'string' && x.length > 0;
});

Match.HexColor = Match.Where(function (x) {
  return /#[A-Fa-f0-9]{3,6}/.test(x);
});