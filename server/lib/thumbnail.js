Meteor.methods({
  fragmentThumbnailUploaded: function (fragmentId, image) {
    check(fragmentId, String);
    check(image, Object);

    var affected = Fragments.update(fragmentId, {
      $set: {
        lead_image: image.secure_url
      },
      $push: {
        images: {
          url: image.secure_url,
          color: undefined,
          s3: {
            id: image._id,
            url: image.relative_url
          }
        }
      }
    });

    if (!affected) {
      throw new Meteor.Error(400, 'Cannot add this thumbnail');
    }
  }
});