// UI Bindings and helpers
UI.setAutofocus(Template.headerUserTooltip, {
  sessionKey: USER_TOOLTIP_KEY
});

Template.headerUserTooltip.helpers({
  rank: function () {
    var count = Fragments.find().count();

    if (!count) {
      return false;
    } else if (count < 4) {
      return 'Bishop of Solitude';
    } else if (count < 10) {
      return 'Master of Silver';
    } else if (count < 20) {
      return 'Counselor of the Veil';
    } else if (count < 50) {
      return 'Baron of Toxins';
    } else {
      return 'Mother of Dragons';
    }
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