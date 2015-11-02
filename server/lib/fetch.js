const extractBaseUrl = 'http://api.embed.ly/1/extract';
const embedlyKey = Meteor.settings.embedlyApiKey;

const titleMaxLength = 100; // characters
const descriptionMaxLength = 140; // characters

Meteor.methods({
  fragmentFetch: function (fragmentId) {
    check(fragmentId, String);

    var fragment = Fragments.findOne(fragmentId);
    var data = fetchUrlSync(fragment.url);

    data.fetched_at = Date.now();

    if (data) {
      Fragments.update(fragment._id, { $set: data });
    }
  }
});

function fetchUrlSync(url) {
  var data = {};

  try {
    result = Meteor.http.get(extractBaseUrl, {
      params: {
        key: embedlyKey,
        url: url
      }
    });

    parseLinkContent(data, result.data);
  }
  catch (err) {
    data.title = 'Not found';
    console.log('Error while fetching URL', url, err);
  }
  finally {
    return data;
  }
}

// -------------------------------------------------------
// Parse the content from Embedly
function parseLinkContent (link, item) {
  [
    'title',
    'description',
    'url',
    'provider_name'
  ].forEach(function (field) {
    link[field] = item[field];
  });

  if (item.provider_display) {
    link.domain = item.provider_display.replace(/^www\./, '');
  }

  // trim long titles
  if (item.title) {
    link.title = item.title.length > titleMaxLength ? item.title.substr(0, titleMaxLength) + '…' : item.title;
  }

  // trim long descriptions
  if (item.description) {
    link.description = item.description.length > descriptionMaxLength ? item.description.substr(0, descriptionMaxLength) + '…' : item.description;
  }

  link.images = [];

  item.images.forEach(function (image) {
    if (link.images.length >= 6) {
      return;
    }

    if (image.width < 200 || image.height < 200) {
      return;
    }

    var firstColor = image.colors && image.colors.length ? image.colors[0] : null;

    link.images.push({
      url: image.url,
      width: image.width,
      height: image.height,
      color: firstColor ? rgbToHex(firstColor.color[0], firstColor.color[1], firstColor.color[2]) : undefined
    });
  });

  if (link.images && link.images.length) {
    link.lead_image = link.images[0].url;
  }

  link.entities = [];

  item.entities.forEach(function (entity) {
    if (link.entities.length >= 6) {
      return;
    }

    if (entity.count > 1) {
      link.entities.push(entity.name);
    }
  });
}

// -------------------------------------------------------
// Helpers

function componentToHex (color) {
  var hex = color.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex (r, g, b) {
  return (componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase();
}