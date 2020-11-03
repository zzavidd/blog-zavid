import { assert, debug, fetch } from '..';
import { SubscriberBuilder, SubscriberDAO } from '../../classes';
import { GET_SUBSCRIBERS_QUERY } from '../../src/private/api/queries/subscriber.queries';
import {
  submitSubscriber,
  updateSubscriber,
  deleteSubscriber,
  compareSubscribers
} from '../helper/subscriber.helper';

describe('Service Tests: Subscriber', function () {
  describe('Get All Subscribers', function () {
    it('All', function (finish) {
      fetch(GET_SUBSCRIBERS_QUERY, {}, function ({ data }: any) {
        assert.isOk(data.subscribers);
        finish();
      });
    });
  });

  describe('Create Subscriber', function () {
    it('Standard', function (finish) {
      const subscriber = new SubscriberBuilder().random().build();
      submitSubscriber(subscriber, (readSubscriber: SubscriberDAO) => {
        compareSubscribers(subscriber, readSubscriber);
        deleteSubscriber(readSubscriber.id!, finish);
      });
    });
  });

  describe('Update Subscriber', function () {
    it('Standard', function (finish) {
      const subscriberToSubmit = new SubscriberBuilder().random().build();
      const subscriberForUpdate = new SubscriberBuilder().random().build();
      Promise.resolve()
        .then(() => submitSubscriber(subscriberToSubmit))
        .then((id) => {
          updateSubscriber(id, subscriberForUpdate, (updatedSubscriber: SubscriberDAO) => {
            compareSubscribers(subscriberForUpdate, updatedSubscriber);
            assert.strictEqual(id, updatedSubscriber.id!);
            deleteSubscriber(id, finish);
          });
        })
        .catch(debug);
    });
  });
});
