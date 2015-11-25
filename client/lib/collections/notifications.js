// Local Collection
Notifications = new Mongo.Collection(null);

// Overrides Bert default values
Bert.defaults = {
  hideDelay: 4000,
  style: 'growl-top-right',
  type: 'default'
};

Notifications._enqueue = function (type, message, isSticky=false) {
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

Notifications.success = function (message) {
  return Bert.alert(message, 'success');
};

Notifications.progress = function (message) {
  return this._enqueue('progress', message, true);
};

Notifications.error = function (message) {
  return Bert.alert(message, 'danger');
};

Notifications.clear = function () {
  this.remove({});
};