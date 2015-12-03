describe('Accessing /login', function () {
  beforeEach(function (done) {
    Router.go('/login');
    Tracker.afterFlush(done);
  });

  beforeEach(waitForRouter);

  it('should display the login page', function () {
    expect($('h1').text()).toBe('Login with your account');
    expect($('input').length).toBe(3);
  });
});