// UI Bindings and helpers
UI.setAutofocus(Template.headerUserTooltip, {
  sessionKey: USER_TOOLTIP_KEY
});

Template.headerUserTooltip.helpers({
  userDescription: function () {
    return 'Standard user';
  }
});

Template.headerUserTooltip.events({
  'click a[data-upload-pic]' : function (event) {
    event.preventDefault();
    event.stopPropagation();

    var $form = $('<form style="display:none"><input type="file" accept="image/*" /></form>'),
        $input = $form.find('input');

    $input.on('change', function (event) {
      var files = this.files;
      Session.set(APP_BUSY_KEY, true);

      Resizer.resize(files[0], {
        width: 200, height: 200, cropSquare: true
      }, function(err, file) {
        S3.upload({
          files: [file],
          path: 'u/' + Meteor.userId() + '/thumb'
        }, function(error, image) {
          if (!error && image) {
            Meteor.call('updateProfilePicture', image.secure_url, function () {
              Session.set(APP_BUSY_KEY, false);
            });
          } else {
            Session.set(APP_BUSY_KEY, false);
          }
        });
      });
    });

    $input.trigger('click');
  }
});