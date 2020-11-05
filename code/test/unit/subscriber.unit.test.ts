import { assert } from '..';
import { SubscriberBuilder, SubscriberStatic } from '../../classes';

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

  describe('Static methods', function () {
    it('Default subscriptions', function (finish) {
      const subscriptions = SubscriberStatic.defaultSubscriptions();
      assert.hasAllKeys(subscriptions, ['Reveries', 'Diary']);
      finish();
    });
  });
});
