const { assert } = require('..');
const { SubscriberBuilder } = require('../../classes');

describe('Unit Tests: Subscriber', function () {
  describe('Object methods', function () {
    it('Test random construction', function (finish) {
      const subscriber = new SubscriberBuilder().random().build();
      assert.hasAllKeys(subscriber, [
        'email',
        'firstname',
        'lastname',
        'subscriptions'
      ]);
      finish();
    });
  });
});
