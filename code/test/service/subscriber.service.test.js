const { assert, classes, debug, fetch } = require('..');
const {
  GET_SUBSCRIBERS_QUERY
} = require('../../src/private/api/queries/subscriber.queries');
const {
  submitSubscriber,
  updateSubscriber,
  deleteSubscriber,
  compareSubscribers
} = require('../helper/subscriber.helper');

const { SubscriberBuilder } = classes;

describe('Service Tests: Subscriber', function () {
  describe('Get All Subscribers', function () {
    it('All', function (finish) {
      fetch(GET_SUBSCRIBERS_QUERY, {}, function ({ data }) {
        assert.isOk(data.subscribers);
        finish();
      });
    });
  });

  describe('Create Subscriber', function () {
    it('Standard', function (finish) {
      const subscriber = new SubscriberBuilder().random().build();
      submitSubscriber(subscriber, (readSubscriber) => {
        compareSubscribers(subscriber, readSubscriber);
        deleteSubscriber(readSubscriber.id, finish);
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
          updateSubscriber(id, subscriberForUpdate, (updatedSubscriber) => {
            compareSubscribers(subscriberForUpdate, updatedSubscriber);
            assert.strictEqual(id, updatedSubscriber.id);
            deleteSubscriber(id, finish);
          });
        })
        .catch(debug);
    });
  });
});
