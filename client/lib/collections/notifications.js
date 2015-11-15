// Local Collection
Notifications = new Mongo.Collection(null);

const REMOVE_AFTER_SECONDS = 5;

Notifications._enqueue = function (type, message) {
  // Only one per type at a time
  this.remove({ type: type });

  var id = this.insert({ type: type, message: message });
  setTimeout(() => {
    this.remove(id);
  }, REMOVE_AFTER_SECONDS * 1000);
  return id;
};

Notifications.success = function (message) {
  return this._enqueue('success', message);
};

Notifications.error = function (message) {
  return this._enqueue('error', message);
};

Notifications.clear = function () {
  this.remove({});
};