import { assert, testWrapper } from '..';
import { SubscriberBuilder } from '../../classes';
import {
  compareSubscribers,
  createSubscriber,
  deleteSubscriber,
  getSingleSubscriber,
  getSubscribers,
  updateSubscriber
} from '../helper/subscriber.helper';

describe('Service Tests: Subscriber', function () {
  describe('Get All Subscribers', function () {
    it(
      'All',
      testWrapper(async () => {
        const subscribers = await getSubscribers();
        assert.isOk(subscribers);
      })
    );
  });

  describe('Create Subscriber', function () {
    it(
      'Standard',
      testWrapper(async () => {
        const subscriber = new SubscriberBuilder().random().build();
        const createdSubscriber = await createSubscriber(subscriber);
        const readSubscriber = await getSingleSubscriber(createdSubscriber.id);
        compareSubscribers(subscriber, readSubscriber);
        await deleteSubscriber(readSubscriber.id!);
      })
    );
  });

  describe('Update Subscriber', function () {
    it(
      'Standard',
      testWrapper(async () => {
        const subscriberToSubmit = new SubscriberBuilder().random().build();
        const subscriberForUpdate = new SubscriberBuilder().random().build();

        const createdSubscriber = await createSubscriber(subscriberToSubmit);
        const updatedSubscriber = await updateSubscriber(
          createdSubscriber.id,
          subscriberForUpdate
        );

        compareSubscribers(subscriberForUpdate, updatedSubscriber);
        assert.strictEqual(createdSubscriber.id, updatedSubscriber.id!);
        await deleteSubscriber(createdSubscriber.id);
      })
    );
  });
});
