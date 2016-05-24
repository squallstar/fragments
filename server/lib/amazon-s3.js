S3.config = {
  key: Meteor.settings.s3ClientId,
  secret: Meteor.settings.s3ClientSecret,
  bucket: Meteor.settings.s3BucketName,
  region: Meteor.settings.s3BucketRegion
};