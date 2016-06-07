// Local Collection
Notification = new Mongo.Collection(null);

// Overrides Bert default values
Bert.defaults = {
  hideDelay: 4000,
  style: 'growl-top-right',
  type: 'default'
};

Notification._enqueue = function (type, message, isSticky=false) {
  // Only one per type at a time
  this.remove({ type: type, sticky: false });

  var id = this.insert({ type: type, message: message, sticky: isSticky });

  if (!isSticky) {
    setTimeout(() => {
      this.remove(id);
    }, Bert.defaults.hideDelay * 1000);
  }

  return id;
};

Notification.success = function (message) {
  return Bert.alert(message, 'success');
};

Notification.progress = function (message) {
  return this._enqueue('progress', message, true);
};

Notification.error = function (message) {
  return Bert.alert(message, 'danger');
};

Notification.clear = function () {
  this.remove({});
};