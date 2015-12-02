// Object container
AdvancedQueries = {};

/**
  * ParseTextQuery (Static)
  * Parses a text query into a Mongo query

  e.g. "from:yesterday foo" will return:
  {
    filteredQuery: "foo",
    results: {
      created_at: { $gte: 123456789 }
    }
  }
*/
AdvancedQueries.ParseTextQuery = function (textQuery) {
  check(textQuery, String);

  let results = {};

  _.each(textQuery.split(' '), (piece) => {
    let result = piece.match(/([A-z]+):([A-z0-9\-]+)/),
        handled = false;

    if (!result || result.length < 3) {
      return;
    }

    let [ input, action, value ] = result;

    switch (action) {
      case 'from':
      case 'to':
      case 'when':
        let date, dayStartTs, dayEndTs;

        // Create date range
        switch (value) {
          case 'today': date = moment(); break;
          case 'yesterday': date = moment().subtract(1, 'days'); break;
          default:
            date = moment(value, 'DD-MM-YYYY');
        }

        if (!date.isValid()) {
          return;
        }

        // Converts range to timestamps
        dayStartTs = Number(date.startOf('day').format('x'));
        dayEndTs = Number(date.endOf('day').format('x'));

        results.created_at = {};

        // Sets "from" range
        if (action === 'from' || action === 'when') {
          results.created_at.$gte = dayStartTs;
        }

        // Sets "up to" range
        if (action === 'to' || action === 'when') {
          results.created_at.$lte = dayStartTs;
        }

        handled = true;
    }

    if (handled) {
      textQuery = textQuery.replace(input, '');
    }
  });

  if (textQuery) {
    results.$text = { $search: textQuery.trim() };
  }

  if (!_.keys(results)) {
    return;
  }

  return results;
};