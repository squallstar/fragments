UI.setErrors = function (template) {
  template.helpers({
    error: function () {
      return Template.instance().error.get();
    }
  });

  template.onCreated(function () {
    this.error = new ReactiveVar();
  });
};