class @FetchFragmentJob extends Job
  handleJob: ->
    Meteor.call 'fragmentFetch', @params.fragmentId