Template.login.events({
  'submit form' : function (event, template) {
    event.preventDefault();

    var email = template.$('input[type="email"]').val().trim(),
        password = template.$('input[type="password"]').val();

    Meteor.loginWithPassword(email, password, function (err) {
      if (err) {
        console.log('err');
      }
    });
  }
});