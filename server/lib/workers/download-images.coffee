class @DownloadImagesJob extends Job
  handleJob: ->
    Meteor.call 'fragmentDownloadImages', @params.fragmentId