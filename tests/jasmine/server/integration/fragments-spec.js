describe('Collection: Fragments', function () {

  describe('When adding one fragment to the database', function () {

    beforeEach(function () {
      Fragments.remove({});
      Fragments.insert({
        title: 'foo'
      });
    });

    it('should exist in the database', function () {
      expect(Fragments.find().count()).toBe(1);
      expect(Fragments.findOne().title).toEqual('foo');
    });

  });

});