var bucket = new AWS.S3();

Meteor.methods({
  fragmentDownloadImages: function (fragmentId) {
    check(fragmentId, String);

    var fragment = Fragments.findOne(fragmentId);

    if (!Array.isArray(fragment.images) || !fragment.images.length) {
      return;
    }

    fragment.images.forEach(function (image, idx) {
      if (!image.url || idx > 4) {
        return;
      }

      var pieces = image.url.split('.');
      var ext = pieces[pieces.length-1].toLowerCase();

      if (['jpg', 'jpeg', 'png'].indexOf(ext) === -1) {
        return; // not an image
      }

      result = Meteor.http.get(image.url, {
        npmRequestOptions: {
          encoding: null
        }
      });

      if ([200, 201].indexOf(result.statusCode) === -1 || !result.content) {
        image.downloadError = true;
        return; // cannot download
      }

      var operation = gm(result.content).resize('500', '500').quality(85);
      var resize = Meteor.wrapAsync(operation.toBuffer, operation);

      try {
        var resized = resize();

        var fileName = 'img-' + Date.now() + '-' + idx + '.' + ext;
        var contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
        var path = 'u/' + fragment.user._id + '/f/' + fragmentId + '/' + fileName;

        var res = bucket.putObjectSync({
          ACL: 'public-read',
          Bucket: Meteor.settings.s3BucketName,
          Key: path,
          ContentType: contentType,
          Body: resized
        });

        image.original_url = image.url;
        image.url = 'https://s3-eu-west-1.amazonaws.com/fragments.me/' + path;

        if (fragment.lead_image === image.original_url) {
          fragment.lead_image = image.url;

          // Update straight away
          Fragments.update(fragmentId, {
            $set: {
              lead_image: fragment.lead_image,
              images: fragment.images
            }
          });
        }

      } catch (e) {
        console.error('Error', e);
      }
    });

    Fragments.update(fragmentId, {
      $set: {
        images: fragment.images
      }
    });
  }
});