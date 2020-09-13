const { validate: uuidValidate } = require('uuid');

const { assert, fetch } = require('..');
const {
  GET_SINGLE_SUBSCRIBER_QUERY,
  CREATE_SUBSCRIBER_QUERY,
  UPDATE_SUBSCRIBER_QUERY,
  DELETE_SUBSCRIBER_QUERY
} = require('../../private/api/queries/subscriber.queries');

/**
 * Submits a subscriber to the server.
 * @param {object} subscriber The subscriber to submit.
 * @param {Function} [assertions] The assertions to make.
 * @returns {Promise} A resolution of the Promise.
 */
exports.submitSubscriber = (subscriber, assertions) => {
  return Promise.resolve()
    .then(() => {
      // Submit the random subscriber.
      return fetch(
        CREATE_SUBSCRIBER_QUERY,
        { variables: { subscriber } },
        function ({ data }) {
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
        function ({ data }) {
          const returnedSubscriber = data.subscriber;
          if (assertions) assertions(returnedSubscriber);
          return returnedSubscriber.id;
        }
      );
    });
};

/**
 * Updates a subscriber on the server.
 * @param {number} id The ID of the subscriber to update.
 * @param {object} subscriber The subscriber to update.
 * @param {Function} [assertions] The assertions to make.
 * @returns {Promise} A resolution of the Promise.
 */
exports.updateSubscriber = (id, subscriber, assertions) => {
  return fetch(
    UPDATE_SUBSCRIBER_QUERY,
    { variables: { id, subscriber } },
    function ({ data }) {
      const updatedSubscriber = data.updateSubscriber;
      assert.strictEqual(updatedSubscriber.id, id);
      if (assertions) assertions(updatedSubscriber);
    }
  );
};

/**
 * Deletes a subscriber from the server.
 * @param {number} id The ID of the subscriber to delete.
 * @param {Function} [assertions] The assertions to make.
 * @returns {Promise} A resolution of the Promise.
 */
exports.deleteSubscriber = (id, assertions) => {
  return Promise.resolve()
    .then(() => {
      // Delete the subscriber.
      return fetch(DELETE_SUBSCRIBER_QUERY, { variables: { id } }, function ({
        data
      }) {
        const deletedSubscriber = data.deleteSubscriber;
        assert.property(deletedSubscriber, 'id');
      });
    })
    .then(() => {
      // Attempt to retrieve subscriber and expect failure.
      return fetch(
        GET_SINGLE_SUBSCRIBER_QUERY,
        { variables: { id }, expectToFail: true },
        function ({ errors }) {
          assert.isOk(errors);
          if (assertions) assertions();
        }
      );
    });
};

/**
 * Compares to subscriber objects.
 * @param {object} request The subscriber submitted from client.
 * @param {object} response The subscriber returned from server.
 */
exports.compareSubscribers = (request, response) => {
  assert.strictEqual(request.email, response.email);
  assert.strictEqual(request.firstname, response.firstname);
  assert.strictEqual(request.lastname, response.lastname);
  assert.deepStrictEqual(request.subscriptions, response.subscriptions);
  assert.isTrue(uuidValidate(response.token));
};
