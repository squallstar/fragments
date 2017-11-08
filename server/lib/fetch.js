const EMBEDLY_BASE_URL = 'http://api.embed.ly/1/extract';

const EMBEDLY_API_KEY = Meteor.settings.embedlyApiKey;

const TITLE_MAX_LENGTH = 100; // characters
const DESCRIPTION_MAX_LENGTH = 140; // characters

/* ------------------------------------------------------------ */

if (!EMBEDLY_API_KEY) {
  throw new Error('EMBEDLY_API_KEY not set');
}

Meteor.methods({
  fragmentFetch: function (fragmentId) {
    check(fragmentId, String);

    var fragment = Fragments.findOne(fragmentId);
    var data = fetchUrlSync(fragment);

    data.fetched_at = Date.now();

    if (data) {
      Fragments.update(fragment._id, { $set: data });

      if (Array.isArray(data.images) && data.images.length) {
        Job.push(new DownloadImagesJob({
          fragmentId: fragmentId
        }));
      }
    }
  }
});

// Fetches the data from Embedly
function fetchUrlSync(fragment) {
  var data = {};

  try {
    result = Meteor.http.get(EMBEDLY_BASE_URL, {
      params: {
        key: EMBEDLY_API_KEY,
        url: fragment.url
      }
    });

    parseLinkContent(fragment, data, result.data);
  }
  catch (err) {
    data.title = 'Not found';
    console.log('Error while fetching URL', fragment.url, err);
  }
  finally {
    return data;
  }
}

// Parse the content from Embedly
function parseLinkContent (fragment, newData, item) {
  [
    'url',
    'provider_name'
  ].forEach(function (field) {
    newData[field] = item[field];
  });

  if (item.provider_display) {
    newData.domain = item.provider_display.replace(/^www\./, '');
  }

  // trim long titles
  if (item.title) {
    newData.title = item.title.length > TITLE_MAX_LENGTH ? item.title.substr(0, TITLE_MAX_LENGTH) + '…' : item.title;
  } else {
    newData.title = 'Untitled';
  }

  // trim long descriptions
  if (item.description) {
    newData.description = item.description.length > DESCRIPTION_MAX_LENGTH ? item.description.substr(0, DESCRIPTION_MAX_LENGTH) + '…' : item.description;
  }

  newData.images = [];

  item.images.forEach(function (image) {
    if (newData.images.length >= 6) {
      return;
    }

    if (image.width < 200 || image.height < 200) {
      return;
    }

    var firstColor = image.colors && image.colors.length ? image.colors[0] : null;

    newData.images.push({
      url: image.url,
      width: image.width,
      height: image.height,
      color: firstColor ? rgbToHex(firstColor.color[0], firstColor.color[1], firstColor.color[2]) : undefined
    });
  });

  if (newData.images && newData.images.length) {
    newData.lead_image = newData.images[0].url;
  }

  newData.tags = fragment.tags || [];

  item.entities.forEach(function (entity) {
    if (newData.tags.length >= 6) {
      return;
    }

    newData.tags.push(entity.name);

    // Temporarily removed to use the above condition
    // if (entity.count > 1) {
    //   newData.tags.push(entity.name);
    // }
  });

  newData.tags = _.uniq(newData.tags);
}

// Converts a string to HEX. e.g. 255 to FF
function componentToHex (color) {
  var hex = color.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

// Converts a color to HEX. e.g. [255,0,0] to #FF0000
function rgbToHex (r, g, b) {
  return (componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase();
}