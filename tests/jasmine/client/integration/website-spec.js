describe('Accessing /', function () {

  beforeEach(function (done) {
    Router.go('/');
    Tracker.afterFlush(done);
  });

  beforeEach(waitForRouter);

  it('should display the website', function () {
    expect($('h1').text()).toEqual('Collect and organise your articles');
  });
});