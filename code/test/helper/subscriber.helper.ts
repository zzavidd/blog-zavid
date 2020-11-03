import { validate as uuidValidate } from 'uuid';

import { assert, debug, fetch } from '..';
import { SubscriberDAO } from '../../classes';
import {
  GET_SINGLE_SUBSCRIBER_QUERY,
  CREATE_SUBSCRIBER_QUERY,
  UPDATE_SUBSCRIBER_QUERY,
  DELETE_SUBSCRIBER_QUERY
} from '../../src/private/api/queries/subscriber.queries';

export const submitSubscriber = (
  subscriber: SubscriberDAO,
  assertions?: Function
): Promise<number> => {
  return Promise.resolve()
    .then(() => {
      // Submit the random subscriber.
      return fetch(
        CREATE_SUBSCRIBER_QUERY,
        { variables: { subscriber } },
        function ({ data }: any) {
          const createdSubscriber = data.createSubscriber;
          assert.property(createdSubscriber, 'id');
          return createdSubscriber;
        }
      );
    })
    .then((createdSubscriber) => {
      // Retrieve the subscriber and run comparison.
      return fetch(
        GET_SINGLE_SUBSCRIBER_QUERY,
        { variables: { id: createdSubscriber.id } },
        function ({ data }: any) {
          const returnedSubscriber = data.subscriber;
          if (assertions) assertions(returnedSubscriber);
          return returnedSubscriber.id;
        }
      );
    })
    .catch(debug);
};

export const updateSubscriber = (
  id: number,
  subscriber: SubscriberDAO,
  assertions?: Function
): Promise<SubscriberDAO> => {
  return fetch(
    UPDATE_SUBSCRIBER_QUERY,
    { variables: { id, subscriber } },
    function ({ data }: any) {
      const updatedSubscriber = data.updateSubscriber;
      assert.strictEqual(updatedSubscriber.id, id);
      if (assertions) assertions(updatedSubscriber);
    }
  );
};

export const deleteSubscriber = (id: number, assertions?: Function) => {
  return Promise.resolve()
    .then(() => {
      // Delete the subscriber.
      return fetch(DELETE_SUBSCRIBER_QUERY, { variables: { id } }, function ({
        data
      }: any) {
        const deletedSubscriber = data.deleteSubscriber;
        assert.property(deletedSubscriber, 'id');
      });
    })
    .then(() => {
      // Attempt to retrieve subscriber and expect failure.
      return fetch(
        GET_SINGLE_SUBSCRIBER_QUERY,
        { variables: { id }, expectToFail: true },
        function ({ errors }: any) {
          assert.isOk(errors);
          if (assertions) assertions();
        }
      );
    })
    .catch(debug);
};

export const compareSubscribers = (request: SubscriberDAO, response: SubscriberDAO) => {
  assert.strictEqual(request.email, response.email);
  assert.strictEqual(request.firstname, response.firstname);
  assert.strictEqual(request.lastname, response.lastname);
  assert.deepStrictEqual(request.subscriptions, response.subscriptions);
  assert.isTrue(uuidValidate(response.token!));
};
