describe('GetTagsSpec', function () {

  beforeEach(function () {
    MeteorStubs.install();
  });

  afterEach(function () {
    MeteorStubs.uninstall();
  });

  describe('getTags', function () {
    it('should return popular tags for the user fragments', function () {
      var tags = Meteor.call('getTags');
      expect(tags).toBe(Array);
    });
  });
});