// Local Collection
Notifications = new Mongo.Collection(null);

const REMOVE_AFTER_SECONDS = 5;

Notifications._enqueue = function (type, message, isSticky=false) {
  // Only one per type at a time
  this.remove({ type: type, sticky: false });

  var id = this.insert({ type: type, message: message, sticky: isSticky });

  if (!isSticky) {
    setTimeout(() => {
      this.remove(id);
    }, REMOVE_AFTER_SECONDS * 1000);
  }

  return id;
};

Notifications.success = function (message) {
  return this._enqueue('success', message);
};

Notifications.progress = function (message) {
  return this._enqueue('progress', message, true);
};

Notifications.error = function (message) {
  return this._enqueue('error', message);
};

Notifications.clear = function () {
  this.remove({});
};