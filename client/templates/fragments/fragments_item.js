// Template.fragmentItem.onRendered(function () {
//   Tracker.autorun(function () {
//     console.log('tracker', this, arguments);
//   });
// });

Template.fragmentItem.helpers({
  isFetching: function () {
    return this.fetched_at === null;
  }
});