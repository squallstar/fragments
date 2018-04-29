const API_BASE_URL = 'https://api.microlink.io/';

const TITLE_MAX_LENGTH = 100; // characters
const DESCRIPTION_MAX_LENGTH = 140; // characters

/* ------------------------------------------------------------ */

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

// Fetches the data from Microlink.io
function fetchUrlSync(fragment) {
  var data = {};

  try {
    result = Meteor.http.get(API_BASE_URL + '?url=' + encodeURIComponent(fragment.url));

    if (result.data.status !== 'success') {
      throw new Error(result.data);
    }

    parseLinkContent(fragment, data, result.data.data);
  }
  catch (err) {
    data.title = 'Not found';
    console.log('Error while fetching URL', fragment.url, err);
  }
  finally {
    return data;
  }
}

// Parse the content from Microlink.io
function parseLinkContent (fragment, newData, item) {
  [
    'url',
    'provider_name'
  ].forEach(function (field) {
    if (item[field]) {
      newData[field] = item[field];
    }
  });

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

  newData.domain = newData.url.replace(/^https?:\/\//, '').split('/')[0];

  newData.tags = fragment.tags || [];

  if (item.publisher) {
    newData.provider_name = item.publisher;
    newData.tags.push(item.publisher);
  }

  if (item.author) {
    newData.provider_name = (newData.provider_name || '') + '(' + item.author + ')';
    newData.tags.push(item.author);
  }

  newData.tags = _.uniq(newData.tags);

  if (item.logo) {
    newData.logo = item.logo;
  }

  newData.images = [];

  var image = item.image;

  if (image && image.url && image.width > 200 && image.height > 200) {
    newData.images.push({
      url: image.url,
      width: image.width,
      height: image.height
    });
  }

  if (newData.images && newData.images.length) {
    newData.lead_image = newData.images[0].url;
  }
}